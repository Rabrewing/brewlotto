import fs from 'fs';
import csv from 'csv-parser';

/**
 * NC Pick 3 CSV Parser for historical data
 */
class NCPick3CSVParser {
  constructor() {
    this.stateCode = 'NC';
    this.gameKey = 'nc-pick3';
  }

  /**
   * Parse NC Pick 3 CSV file
   */
  async parseCSV(filePath) {
    const draws = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // CSV structure: Date, Day/Eve, Ball 1, Ball 2, Ball 3, Fireball, GreenBall, DoubleDraw*
          const date = row.Date;
          const drawType = row['Day/Eve'] === 'D' ? 'day' : 'evening';
          const numbers = [
            parseInt(row['Ball 1']),
            parseInt(row['Ball 2']),
            parseInt(row['Ball 3'])
          ].filter(n => !isNaN(n));
          
          const fireball = row.Fireball ? parseInt(row.Fireball) : null;
          const greenball = row.GreenBall ? parseInt(row.GreenBall) : null;
          
          if (date && numbers.length === 3) {
            draws.push({
              draw_date: this.formatDate(date),
              draw_type: drawType,
              numbers,
              fireball: !isNaN(fireball) ? fireball : null,
              greenball: !isNaN(greenball) ? greenball : null
            });
          }
        })
        .on('end', () => {
          console.log(`✅ Parsed ${draws.length} NC Pick 3 draws from CSV`);
          resolve(draws);
        })
        .on('error', reject);
    });
  }

  formatDate(dateStr) {
    // Format: 03/16/2026
    const [m, d, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
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
      game_id: null,
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

/**
 * NC Pick 4 CSV Parser for historical data
 */
class NCPick4CSVParser {
  constructor() {
    this.stateCode = 'NC';
    this.gameKey = 'nc-pick4';
  }

  async parseCSV(filePath) {
    const draws = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // CSV structure: Date, Day/Eve, Ball 1, Ball 2, Ball 3, Ball 4, Fireball
          const date = row.Date;
          const drawType = row['Day/Eve'] === 'D' ? 'day' : 'evening';
          const numbers = [
            parseInt(row['Ball 1']),
            parseInt(row['Ball 2']),
            parseInt(row['Ball 3']),
            parseInt(row['Ball 4'])
          ].filter(n => !isNaN(n));
          
          const fireball = row.Fireball ? parseInt(row.Fireball) : null;
          
          if (date && numbers.length === 4) {
            draws.push({
              draw_date: this.formatDate(date),
              draw_type: drawType,
              numbers,
              fireball: !isNaN(fireball) ? fireball : null
            });
          }
        })
        .on('end', () => {
          console.log(`✅ Parsed ${draws.length} NC Pick 4 draws from CSV`);
          resolve(draws);
        })
        .on('error', reject);
    });
  }

  formatDate(dateStr) {
    const [m, d, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  normalizeDraw(rawDraw) {
    const specialValues = {};
    if (rawDraw.fireball !== null && rawDraw.fireball !== undefined) {
      specialValues.fireball = rawDraw.fireball;
    }

    return {
      game_id: null,
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

/**
 * NC Cash 5 CSV Parser for historical data
 */
class NCCash5CSVParser {
  constructor() {
    this.stateCode = 'NC';
    this.gameKey = 'nc-cash5';
  }

  async parseCSV(filePath) {
    const draws = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // CSV structure: Date, Ball 1, Ball 2, Ball 3, Ball 4, Ball 5, DP
          const date = row.Date;
          const numbers = [
            parseInt(row['Ball 1']),
            parseInt(row['Ball 2']),
            parseInt(row['Ball 3']),
            parseInt(row['Ball 4']),
            parseInt(row['Ball 5'])
          ].filter(n => !isNaN(n));
          
          const dp = row.DP ? parseInt(row.DP) : null;
          
          if (date && numbers.length === 5) {
            draws.push({
              draw_date: this.formatDate(date),
              draw_type: 'daily',
              numbers,
              doublePlay: !isNaN(dp) ? dp : null
            });
          }
        })
        .on('end', () => {
          console.log(`✅ Parsed ${draws.length} NC Cash 5 draws from CSV`);
          resolve(draws);
        })
        .on('error', reject);
    });
  }

  formatDate(dateStr) {
    const [m, d, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
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
      draw_datetime_local: new Date(`${rawDraw.draw_date}T23:00`).toISOString(),
      primary_numbers: rawDraw.numbers,
      bonus_numbers: [],
      special_values: specialValues,
      result_status: 'official'
    };
  }
}

export { NCPick3CSVParser, NCPick4CSVParser, NCCash5CSVParser };
