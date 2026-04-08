#!/usr/bin/env node

/**
 * Fetch California lottery data script
 * Fetches historical data for CA Daily 3, Daily 4, and Fantasy 5
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Data directory path
const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const DATA_DIR = path.join(__dirname, '..', 'data', 'ca');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Fetch CA Daily 3 data from lotto-8.com
 */
async function fetchCADaily3() {
  console.log('📋 Fetching CA Daily 3 data...');
  const draws = [];
  
  try {
    // Use lotto-8.com for historical data
    const url = 'https://www.lotto-8.com/usa/listlto3.asp';
    const resp = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(resp.data);
    
    // Find the table with draw data
    const rows = $('table tbody tr');
    rows.each((_, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 3) {
        const dateText = $(tds[0]).text().trim();
        const numbersText = $(tds[1]).text().trim();
        
        // Parse numbers (format: 1-2-3 or similar)
        const numbers = numbersText
          .split(/[\s,-]+/)
          .map(n => n.trim())
          .filter(n => n && !isNaN(parseInt(n)))
          .map(n => parseInt(n));
          
        if (numbers.length === 3 && dateText) {
          draws.push({
            date: dateText,
            numbers: numbers,
            game: 'Daily 3'
          });
        }
      }
    });
  } catch (err) {
    console.error('❌ Error fetching CA Daily 3:', err.message);
  }
  
  console.log(`✅ Found ${draws.length} CA Daily 3 draws`);
  return draws;
}

/**
 * Fetch CA Daily 4 data from lotto-8.com
 */
async function fetchCADaily4() {
  console.log('📋 Fetching CA Daily 4 data...');
  const draws = [];
  
  try {
    const url = 'https://www.lotto-8.com/usa/listlto4.asp';
    const resp = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(resp.data);
    
    const rows = $('table tbody tr');
    rows.each((_, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 3) {
        const dateText = $(tds[0]).text().trim();
        const numbersText = $(tds[1]).text().trim();
        
        const numbers = numbersText
          .split(/[\s,-]+/)
          .map(n => n.trim())
          .filter(n => n && !isNaN(parseInt(n)))
          .map(n => parseInt(n));
          
        if (numbers.length === 4 && dateText) {
          draws.push({
            date: dateText,
            numbers: numbers,
            game: 'Daily 4'
          });
        }
      }
    });
  } catch (err) {
    console.error('❌ Error fetching CA Daily 4:', err.message);
  }
  
  console.log(`✅ Found ${draws.length} CA Daily 4 draws`);
  return draws;
}

/**
 * Fetch CA Fantasy 5 data from lotto-8.com
 */
async function fetchCAFantasy5() {
  console.log('📋 Fetching CA Fantasy 5 data...');
  const draws = [];
  
  try {
    const url = 'https://www.lotto-8.com/usa/listltoFT5.asp';
    const resp = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(resp.data);
    
    const rows = $('table tbody tr');
    rows.each((_, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 2) {
        const dateText = $(tds[0]).text().trim();
        const numbersText = $(tds[1]).text().trim();
        
        const numbers = numbersText
          .split(',')
          .map(n => n.trim())
          .filter(n => n && !isNaN(parseInt(n)))
          .map(n => parseInt(n));
          
        if (numbers.length === 5 && dateText) {
          draws.push({
            date: dateText,
            numbers: numbers,
            game: 'Fantasy 5'
          });
        }
      }
    });
  } catch (err) {
    console.error('❌ Error fetching CA Fantasy 5:', err.message);
  }
  
  console.log(`✅ Found ${draws.length} CA Fantasy 5 draws`);
  return draws;
}

/**
 * Save data to CSV file
 */
function saveToCSV(draws, filename) {
  if (draws.length === 0) {
    console.log(`⚠️ No data to save for ${filename}`);
    return;
  }
  
  const filePath = path.join(DATA_DIR, filename);
  const header = 'Date,Game,Ball 1,Ball 2,Ball 3,Ball 4,Ball 5\n';
  const rows = draws.map(d => {
    const nums = d.numbers.map(n => n.toString().padStart(2, '0'));
    while (nums.length < 5) nums.push('');
    return `${d.date},${d.game},${nums.join(',')}`;
  }).join('\n');
  
  fs.writeFileSync(filePath, header + rows);
  console.log(`✅ Saved ${draws.length} records to ${filePath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting California Lottery Data Fetch...\n');
  
  try {
    // Fetch all game data
    const [daily3, daily4, fantasy5] = await Promise.all([
      fetchCADaily3(),
      fetchCADaily4(),
      fetchCAFantasy5()
    ]);
    
    // Save to CSV files
    saveToCSV(daily3, 'ca-daily3.csv');
    saveToCSV(daily4, 'ca-daily4.csv');
    saveToCSV(fantasy5, 'ca-fantasy5.csv');
    
    console.log('\n✅ California data fetch complete!');
    console.log(`   - Daily 3: ${daily3.length} draws`);
    console.log(`   - Daily 4: ${daily4.length} draws`);
    console.log(`   - Fantasy 5: ${fantasy5.length} draws`);
    
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fetchCADaily3, fetchCADaily4, fetchCAFantasy5 };