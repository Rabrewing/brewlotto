const BaseParser = require('../baseParser');
const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../../utils/dateUtils');

/**
 * NC Pick 3 specific parser
 */
class NCPick3Parser extends BaseParser {
  constructor() {
    super({
      stateCode: 'NC',
      gameKey: 'nc-pick3',
      sourceKey: 'official-website'
    });
    this.MONTHS_BACK = 24;
  }

  async fetch() {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < this.MONTHS_BACK; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const url = `https://nclottery.com/pick3-past-draws?month=${dt.getMonth() + 1}&year=${dt.getFullYear()}`;

      try {
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        $('.past-draws-table tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          const date = $(tds[0]).text().trim();
          const draw_type = $(tds[1]).text().toLowerCase().includes('day') ? 'day' : 'evening';
          const numbers = $(tds[2])
            .text()
            .split('-')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));
          
          // Check for fireball in additional columns
          const fireballCell = $(tds[3]);
          const fireball = fireballCell.length > 0 ? parseInt(fireballCell.text().trim()) : null;
          const greenballCell = $(tds[4]);
          const greenball = greenballCell.length > 0 ? parseInt(greenballCell.text().trim()) : null;

          if (date && numbers.length === 3) {
            allDraws.push({
              draw_date: formatDate(date),
              draw_type,
              numbers,
              fireball: !isNaN(fireball) ? fireball : null,
              greenball: !isNaN(greenball) ? greenball : null
            });
          }
        });
      } catch (err) {
        console.error(`❌ Failed to fetch ${url}:`, err.message);
        // Continue with other months even if one fails
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
      Array.isArray(draw.numbers) &&
      draw.numbers.length === 3 &&
      draw.numbers.every(n => n >= 0 && n <= 9);
  }

  normalizeDraw(rawDraw) {
    const specialValues = {};
    if (rawDraw.fireball !== null && rawDraw.fireball !== undefined) {
      specialValues.fireball = rawDraw.fireball;
    }
    if (rawDraw.greenball !== null && rawDraw.greenball !== undefined) {
      specialValues.greenball = rawDraw.greenball;
    }
    
    return {
      game_id: null, // Will be set during ingestion process
      draw_date: rawDraw.draw_date,
      draw_window_label: rawDraw.draw_type,
      draw_datetime_local: new Date(`${rawDraw.draw_date}T${rawDraw.draw_type === 'day' ? '12:30' : '21:30'}`).toISOString(),
      primary_numbers: rawDraw.numbers,
      bonus_numbers: [],
      special_values: specialValues,
      result_status: 'official'
    };
  }
}

module.exports = NCPick3Parser;