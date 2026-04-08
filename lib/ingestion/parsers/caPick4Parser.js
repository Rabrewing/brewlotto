const BaseParser = require('../baseParser');
const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../../utils/dateUtils');

/**
 * CA Pick 4 (Daily 4) specific parser
 * NOTE: The URL and parsing logic may need adjustment based on the actual CA lottery website.
 */
class CAPick4Parser extends BaseParser {
  constructor() {
    super({
      stateCode: 'CA',
      gameKey: 'ca-pick4',
      sourceKey: 'official-website'
    });
    this.MONTHS_BACK = 24;
  }

  async fetch() {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < this.MONTHS_BACK; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      // TODO: Replace with the actual URL for CA Pick 4 past draws
      const url = `https://www.calottery.com/draw-games/daily-4/past?month=${dt.getMonth() + 1}&year=${dt.getFullYear()}`;

      try {
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        // TODO: Adjust the selector based on the actual HTML structure of the CA lottery website
        $('.past-draws-table tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          const date = $(tds[0]).text().trim();
          // Assuming the draw type (afternoon/evening) is in the second column
          const draw_type_raw = $(tds[1]).text().toLowerCase().trim();
          let draw_type;
          if (draw_type_raw.includes('afternoon') || draw_type_raw.includes('pm')) {
            draw_type = 'afternoon';
          } else if (draw_type_raw.includes('evening') || draw_type_raw.includes('pm')) {
            draw_type = 'evening';
          } else {
            // Default to afternoon if we can't determine
            draw_type = 'afternoon';
          }
          // Assuming the numbers are in the third column, format like "1-2-3-4"
          const numbersText = $(tds[2]).text().trim();
          const numbers = numbersText
            .split('-')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));

          if (date && numbers.length === 4) {
            allDraws.push({
              draw_date: formatDate(date),
              draw_type, // afternoon or evening
              numbers
            });
          }
        });
      } catch (err) {
        console.error(`❌ Failed to fetch CA Pick 4 data for ${dt.toISOString()}:`, err.message);
      }
    }

    return allDraws;
  }

  parse(rawData) {
    return rawData;
  }

  validate(draw) {
    return draw &&
      draw.draw_date &&
      draw.draw_type &&
      Array.isArray(draw.numbers) &&
      draw.numbers.length === 4 &&
      draw.numbers.every(n => n >= 0 && n <= 9);
  }

  normalizeDraw(rawDraw) {
    // Set time based on draw_type
    let time = '13:29'; // default to afternoon
    if (rawDraw.draw_type === 'evening') {
      time = '18:59';
    }
    return {
      game_id: null, // Will be set during ingestion process
      draw_date: rawDraw.draw_date,
      draw_window_label: rawDraw.draw_type,
      draw_datetime_local: new Date(`${rawDraw.draw_date}T${time}`).toISOString(),
      primary_numbers: rawDraw.numbers,
      bonus_numbers: [],
      special_values: {},
      result_status: 'official'
    };
  }
}

module.exports = CAPick4Parser;