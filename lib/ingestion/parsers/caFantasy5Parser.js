const BaseParser = require('../baseParser');
const axios = require('axios');
const cheerio = require('cheerio');
const { formatDate } = require('../../utils/dateUtils');

/**
 * CA Fantasy 5 specific parser
 */
class CAFantasy5Parser extends BaseParser {
  constructor() {
    super({
      stateCode: 'CA',
      gameKey: 'ca-fantasy5',
      sourceKey: 'official-website'
    });
    this.MONTHS_BACK = 12; // Less data for now to avoid rate limits
  }

  async fetch() {
    const allDraws = [];
    const today = new Date();

    for (let i = 0; i < this.MONTHS_BACK; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const url = `https://www.lotto-8.com/usa/listltoFT5.asp?indexpage=${i + 1}`;

      try {
        const resp = await axios.get(url);
        const $ = cheerio.load(resp.data);

        // Parse table rows
        $('table tbody tr').each((_, el) => {
          const tds = $(el).find('td');
          if (tds.length >= 2) {
            const dateText = $(tds[0]).text().trim();
            const numbersText = $(tds[1]).text().trim();

            // Parse date from format like "15/0326(SUN)" or "09/0104(FRI)"
            const dateMatch = dateText.match(/(\d{1,2})\/(\d{4})/);
            if (dateMatch) {
              const day = parseInt(dateMatch[1]);
              const monthYear = dateMatch[2]; // Format: MMDD or similar
              // Extract month and year from the string
              const month = parseInt(monthYear.substring(0, 2)) - 1; // 0-indexed
              const year = 2000 + parseInt(monthYear.substring(2, 4)); // Assuming 20xx

              const dateStr = `${month + 1}/${day}/${year}`;
              const formattedDate = formatDate(dateStr);

              // Parse numbers: format like "13, 23, 25, 34, 36"
              const numbers = numbersText
                .split(',')
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n) && n >= 1 && n <= 39);

              if (formattedDate && numbers.length === 5) {
                allDraws.push({
                  draw_date: formattedDate,
                  draw_type: 'evening',
                  numbers
                });
              }
            }
          }
        });
      } catch (err) {
        console.error(`❌ Failed to fetch CA Fantasy 5 data for page ${i + 1}:`, err.message);
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
      draw.numbers.every(n => n >= 1 && n <= 39);
  }

  normalizeDraw(rawDraw) {
    return {
      game_id: null,
      draw_date: rawDraw.draw_date,
      draw_window_label: rawDraw.draw_type,
      draw_datetime_local: new Date(`${rawDraw.draw_date}T18:45`).toISOString(), // CA Fantasy 5 draws at 6:45 PM PT
      primary_numbers: rawDraw.numbers,
      bonus_numbers: [],
      special_values: {},
      result_status: 'official'
    };
  }
}

module.exports = CAFantasy5Parser;
