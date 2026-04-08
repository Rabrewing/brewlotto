/**
 * Base class for all lottery data parsers
 */
class BaseParser {
  /**
   * @param {Object} options
   * @param {string} options.stateCode - State code (e.g., 'NC', 'CA')
   * @param {string} options.gameKey - Game key (e.g., 'nc-pick3')
   * @param {string} options.sourceKey - Source key (e.g., 'official-website')
   */
  constructor({ stateCode, gameKey, sourceKey }) {
    this.stateCode = stateCode;
    this.gameKey = gameKey;
    this.sourceKey = sourceKey;
  }

  /**
   * Fetch raw data from the source
   * @returns {Promise<any>} Raw data from the source
   */
  async fetch() {
    throw new Error('Fetch method must be implemented by subclass');
  }

  /**
   * Parse raw data into normalized draw objects
   * @param {any} rawData - Raw data from fetch()
   * @returns {Promise<Array<Object>>} Array of normalized draw objects
   */
  async parse(rawData) {
    throw new Error('Parse method must be implemented by subclass');
  }

  /**
   * Validate a normalized draw object
   * @param {Object} draw - Normalized draw object
   * @returns {boolean} True if valid
   */
  validate(draw) {
    // Basic validation - subclasses can override
    return draw &&
      draw.draw_date &&
      Array.isArray(draw.numbers) &&
      draw.numbers.length > 0;
  }

  /**
   * Normalize a raw draw entry to the standard format
   * @param {Object} rawDraw - Raw draw data from the source
   * @returns {Object} Normalized draw object
   */
  normalizeDraw(rawDraw) {
    // Subclasses should implement this to map their specific format to our standard format
    throw new Error('NormalizeDraw method must be implemented by subclass');
  }

  /**
   * Run the full ingestion process for this parser
   * @returns {Promise<Object>} Result object with stats
   */
  async ingest() {
    let rawData;
    let draws = [];
    let validDraws = [];
    let invalidDraws = 0;

    try {
      rawData = await this.fetch();
      draws = await this.parse(rawData);
      
      for (const draw of draws) {
        if (this.validate(draw)) {
          validDraws.push(this.normalizeDraw(draw));
        } else {
          invalidDraws++;
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        drawsSeen: 0,
        drawsInserted: 0
      };
    }

    return {
      success: true,
      drawsSeen: draws.length,
      drawsInserted: validDraws.length,
      invalidDraws,
      draws: validDraws
    };
  }
}

module.exports = BaseParser;