const BaseParser = require('../baseParser');
const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../../utils/dateUtils');

/**
 * NC Cash 5 specific parser
 */
class NCCash5Parser extends BaseParser {
  constructor() {
    super({
      stateCode: 'NC',
      gameKey: 'nc-cash5',
      sourceKey: 'official-website'
    });
    this.MONTHS_BACK = 24;
  }

  async fetch() {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < this.MONTHS_BACK; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const url = `https://nclottery.com/cash5-past-draws?month=${dt.getMonth() + 1}&year=${dt.getFullYear()}`;

      try {
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        $('.past-draws-table tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          const date = $(tds[0]).text().trim();
          const numbers = $(tds[1])
            .text()
            .split('-')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));
          
          // Check for Double Play (DP) in additional columns
          const dpCell = $(tds[2]);
          const dp = dpCell.length > 0 ? parseInt(dpCell.text().trim()) : null;

          if (date && numbers.length === 5) {
            allDraws.push({
              draw_date: formatDate(date),
              draw_type: 'daily', // Cash 5 is daily
              numbers,
              doublePlay: !isNaN(dp) ? dp : null
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
    return rawData;
  }

  validate(draw) {
    return draw &&
      draw.draw_date &&
      draw.draw_type &&
      Array.isArray(draw.numbers) &&
      draw.numbers.length === 5 &&
      draw.numbers.every(n => n >= 1 && n <= 43); // Cash 5 numbers are 1-43
  }

  normalizeDraw(rawDraw) {
    const specialValues = {};
    if (rawDraw.doublePlay !== null && rawDraw.doublePlay !== undefined) {
      specialValues.doublePlay = rawDraw.doublePlay;
    }
    
    return {
      game_id: null,
      draw_date: rawDraw.draw_date,
      draw_window_label: rawDraw.draw_type,
      draw_datetime_local: new Date(`${rawDraw.draw_date}T23:00`).toISOString(), // Cash 5 draws at 11:00 PM
      primary_numbers: rawDraw.numbers,
      bonus_numbers: [],
      special_values: specialValues,
      result_status: 'official'
    };
  }
}

module.exports = NCCash5Parser;