const { supabase } = require('../supabase/serverClient.cjs');
const DrawIngestionRun = require('./drawIngestionRun');

/**
 * Manages the ingestion process for lottery data
 */
class IngestionManager {
  constructor() {
    this.parsers = new Map();
    this.running = false;
  }

  /**
   * Register a parser for a specific game
   * @param {string} gameKey - The game key (e.g., 'nc-pick3')
   * @param {Object} parser - Parser instance
   */
  registerParser(gameKey, parser) {
    this.parsers.set(gameKey, parser);
  }

  /**
   * Get a parser for a specific game
   * @param {string} gameKey - The game key
   * @returns {Object|null} Parser instance or null if not found
   */
  getParser(gameKey) {
    return this.parsers.get(gameKey) || null;
  }

  /**
   * Run ingestion for a specific game
   * @param {string} gameKey - The game key to ingest
   * @returns {Promise<Object>} Result of the ingestion process
   */
  async ingestGame(gameKey) {
    const parser = this.getParser(gameKey);
    if (!parser) {
      throw new Error(`No parser registered for game: ${gameKey}`);
    }

    // Create a new ingestion run record
    const run = await DrawIngestionRun.createRun({
      gameKey,
      sourceKey: parser.sourceKey,
      runType: 'scheduled'
    });

    try {
      // Update run status to running
      await run.updateStatus('running');

      // Execute the parser
      const result = await parser.ingest();

      if (result.success) {
        // Store the draws in the database
        const storedCount = await this.storeDraws(gameKey, result.draws);
        
        // Update the run with success status
        await run.updateStatus('succeeded', {
          drawsSeen: result.drawsSeen,
          drawsInserted: storedCount,
          drawsUpdated: 0, // We're not implementing updates in V1 for simplicity
          drawsSkipped: result.drawsSeen - storedCount,
          logSummary: `Ingested ${storedCount} draws for ${gameKey}`
        });

        return {
          success: true,
          gameKey,
          drawsSeen: result.drawsSeen,
          drawsInserted: storedCount
        };
      } else {
        // Update the run with failed status
        await run.updateStatus('failed', {
          errorCount: 1,
          logSummary: `Failed to ingest ${gameKey}: ${result.error}`
        });

        return {
          success: false,
          gameKey,
          error: result.error
        };
      }
    } catch (error) {
      // Update the run with failed status
      await run.updateStatus('failed', {
        errorCount: 1,
        logSummary: `Error ingesting ${gameKey}: ${error.message}`
      });

      return {
        success: false,
        gameKey,
        error: error.message
      };
    }
  }

  /**
   * Store draw data in the database
   * @param {string} gameKey - The game key
   * @param {Array<Object>} draws - Array of draw objects to store
   * @returns {Promise<number>} Number of draws stored
   */
  async storeDraws(gameKey, draws) {
    if (!draws || draws.length === 0) {
      return 0;
    }

    // Get the game ID from the database
    const { data: gameData, error: gameError } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('game_key', gameKey)
      .single();

    if (gameError) {
      throw new Error(`Failed to get game ID for ${gameKey}: ${gameError.message}`);
    }

    const gameId = gameData.id;

    // Prepare draws for insertion
    const drawRecords = draws.map(draw => ({
      game_id: gameId,
      draw_date: draw.draw_date,
      draw_window_label: draw.draw_window_label,
      draw_datetime_local: draw.draw_datetime_local,
      primary_numbers: draw.primary_numbers,
      bonus_numbers: draw.bonus_numbers || [],
      special_values: draw.special_values || {},
      result_status: draw.result_status || 'official',
      source_id: null // In V1, we'll set this properly later
    }));

    // Insert the draws
    const { data, error, count } = await supabase
      .from('official_draws')
      .upsert(drawRecords, {
        onConflict: 'game_id,draw_date,draw_window_label,draw_sequence'
      });

    if (error) {
      throw new Error(`Failed to store draws for ${gameKey}: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Run ingestion for all registered games
   * @returns {Promise<Object>} Results for all games
   */
  async ingestAllGames() {
    if (this.running) {
      return { success: false, error: 'Ingestion already running' };
    }

    this.running = true;
    const results = {};

    try {
      for (const [gameKey] of this.parsers.entries()) {
        results[gameKey] = await this.ingestGame(gameKey);
      }

      return {
        success: true,
        results
      };
    } finally {
      this.running = false;
    }
  }
}

module.exports = new IngestionManager();
