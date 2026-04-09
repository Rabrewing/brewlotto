const { supabase } = require('../supabase/serverClient.cjs');

/**
 * Helper class for managing draw ingestion run records
 */
class DrawIngestionRun {
  /**
   * Create a new ingestion run record
   * @param {Object} data - Run data
   * @param {string} data.gameKey - The game key
   * @param {string} data.sourceKey - The source key
   * @param {string} data.runType - The run type (scheduled, manual, backfill, retry)
   * @returns {Promise<Object>} Created run record
   */
  static async createRun({ gameKey, sourceKey, runType }) {
    // Get the game ID
    const { data: gameData, error: gameError } = await supabase
      .from('lottery_games')
      .select('id')
      .eq('game_key', gameKey)
      .single();

    if (gameError) {
      throw new Error(`Failed to get game ID for ${gameKey}: ${gameError.message}`);
    }

    // Get the source ID
    const { data: sourceData, error: sourceError } = await supabase
      .from('draw_sources')
      .select('id')
      .eq('source_key', sourceKey)
      .single();

    if (sourceError) {
      throw new Error(`Failed to get source ID for ${sourceKey}: ${sourceError.message}`);
    }

    // Create the run record
    const { data, error } = await supabase
      .from('draw_ingestion_runs')
      .insert({
        game_id: gameData.id,
        source_id: sourceData.id,
        run_type: runType,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ingestion run: ${error.message}`);
    }

    return new DrawIngestionRun(data);
  }

  constructor(data) {
    this.id = data.id;
    this.game_id = data.game_id;
    this.source_id = data.source_id;
    this.run_type = data.run_type;
    this.status = data.status;
    this.started_at = data.started_at;
    this.finished_at = data.finished_at;
    this.draws_seen = data.draws_seen || 0;
    this.draws_inserted = data.draws_inserted || 0;
    this.draws_updated = data.draws_updated || 0;
    this.draws_skipped = data.draws_skipped || 0;
    this.error_count = data.error_count || 0;
    this.warning_count = data.warning_count || 0;
    this.freshness_observed_at = data.freshness_observed_at;
    this.log_summary = data.log_summary;
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Update the status of this run
   * @param {string} status - New status
   * @param {Object} updates - Additional fields to update
   * @returns {Promise<Object>} Updated run record
   */
  async updateStatus(status, updates = {}) {
    const updateData = {
      status,
      ...updates
    };

    if (status === 'running' && !this.started_at) {
      updateData.started_at = new Date().toISOString();
    }

    if (['succeeded', 'partial', 'failed'].includes(status)) {
      updateData.finished_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('draw_ingestion_runs')
      .update(updateData)
      .eq('id', this.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ingestion run: ${error.message}`);
    }

    // Update instance properties
    for (const [key, value] of Object.entries(data)) {
      this[key] = value;
    }

    return data;
  }

  /**
   * Add an error to the ingestion errors table
   * @param {Object} errorData - Error data
   * @returns {Promise<Object>} Created error record
   */
  async addError(errorData) {
    const { data, error } = await supabase
      .from('draw_ingestion_errors')
      .insert({
        run_id: this.id,
        severity: errorData.severity || 'error',
        error_code: errorData.error_code,
        message: errorData.message,
        raw_context: errorData.raw_context || {}
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add ingestion error: ${error.message}`);
    }

    // Increment error count
    await this.updateStatus(this.status, {
      error_count: this.error_count + 1
    });

    return data;
  }
}

module.exports = DrawIngestionRun;
