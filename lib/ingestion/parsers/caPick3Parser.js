const BaseParser = require('../baseParser');
const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../../utils/dateUtils');

/**
 * CA Pick 3 specific parser
 */
class CAPick3Parser extends BaseParser {
  constructor() {
    super({
      stateCode: 'CA',
      gameKey: 'ca-pick3',
      sourceKey: 'official-website'
    });
    this.MONTHS_BACK = 24;
  }

  async fetch() {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < this.MONTHS_BACK; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const url = `https://www.calottery.com/draw-games/daily-3`;

      try {
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        // CA Lottery uses a different structure - we'll need to adapt
        // This is a simplified version - actual implementation would need to parse their specific format
        $('.draw-results tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          const date = $(tds[0]).text().trim();
          const numbersText = $(tds[1]).text().trim();
          
          // Parse numbers: format like "1-2-3"
          const numbers = numbersText
            .split('-')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));

          if (date && numbers.length === 3) {
            allDraws.push({
              draw_date: formatDate(date),
              draw_type: 'daily',
              numbers
            });
          }
        });
      } catch (err) {
        console.error(`❌ Failed to fetch CA Pick 3 data for ${dt.toISOString()}:`, err.message);
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
      draw.numbers.length === 3 &&
      draw.numbers.every(n => n >= 0 && n <= 9);
  }

  normalizeDraw(rawDraw) {
    // CA Daily 3 has Fireball as a bonus number
    const specialValues = {};
    if (rawDraw.fireball !== null && rawDraw.fireball !== undefined) {
      specialValues.fireball = rawDraw.fireball;
    }
    
    return {
      game_id: null,
      draw_date: rawDraw.draw_date,
      draw_window_label: rawDraw.draw_type,
      draw_datetime_local: new Date(`${rawDraw.draw_date}T18:30`).toISOString(), // CA draws at 6:30 PM PT
      primary_numbers: rawDraw.numbers,
      bonus_numbers: [],
      special_values: specialValues,
      result_status: 'official'
    };
  }
}

module.exports = CAPick3Parser;