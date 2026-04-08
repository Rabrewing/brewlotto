const BaseParser = require('../baseParser');
const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../../utils/dateUtils');

/**
 * NC Powerball specific parser
 */
class NCPowerballParser extends BaseParser {
  constructor() {
    super({
      stateCode: 'NC',
      gameKey: 'nc-powerball',
      sourceKey: 'official-website'
    });
    this.MONTHS_BACK = 24;
  }

  async fetch() {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < this.MONTHS_BACK; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const url = `https://nclottery.com/powerball-past-draws?month=${dt.getMonth() + 1}&year=${dt.getFullYear()}`;

      try {
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        $('.past-draws-table tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          const date = $(tds[0]).text().trim();
          const draw_type = $(tds[1]).text().toLowerCase().includes('wed') || $(tds[1]).text().toLowerCase().includes('sat') ? 
                            ($(tds[1]).text().toLowerCase().includes('wed') ? 'wed' : 'sat') : 'unknown';
          const numbersText = $(tds[2]).text().trim();
          const bonusText = $(tds[3]).text().trim();

          // Parse numbers: format like "01 - 02 - 03 - 04 - 05"
          const primaryNumbers = numbersText
            .split('-')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));

          // Parse bonus number
          const bonusNumber = parseInt(bonusText.trim());
          const isBonusValid = !isNaN(bonusNumber) && bonusNumber >= 1 && bonusNumber <= 26;

          if (date && primaryNumbers.length === 5 && isBonusValid) {
            allDraws.push({
              draw_date: formatDate(date),
              draw_type, // wed or sat
              primary_numbers: primaryNumbers,
              bonus_number: bonusNumber
            });
          }
        });
      } catch (err) {
        console.error(`❌ Failed to fetch ${url}:`, err.message);
      }
    }

    return allDraws;
  }

  parse(rawData) {
    // The fetch method already returns parsed data for this source
    return rawData;
  }

  validate(draw) {
    return draw &&
      draw.draw_date &&
      draw.draw_type &&
      Array.isArray(draw.primary_numbers) &&
      draw.primary_numbers.length === 5 &&
      draw.primary_numbers.every(n => n >= 1 && n <= 69) &&
      typeof draw.bonus_number === 'number' &&
      draw.bonus_number >= 1 &&
      draw.bonus_number <= 26;
  }

  normalizeDraw(rawDraw) {
    // Determine draw window label based on day
    const drawTime = rawDraw.draw_type === 'wed' ? '20:59' : '20:59'; // Powerball draws at 8:59 PM ET
    return {
      game_id: null, // Will be set during ingestion process
      draw_date: rawDraw.draw_date,
      draw_window_label: rawDraw.draw_type, // wed or sat
      draw_datetime_local: new Date(`${rawDraw.draw_date}T${drawTime}`).toISOString(),
      primary_numbers: rawDraw.primary_numbers,
      bonus_numbers: [rawDraw.bonus_number], // Store as array
      special_values: {},
      result_status: 'official'
    };
  }
}

module.exports = NCPowerballParser;