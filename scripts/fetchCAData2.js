#!/usr/bin/env node

/**
 * Fetch California Pick 3 and Pick 4 data from alternative sources
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const DATA_DIR = path.join(__dirname, '..', 'data', 'ca');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Fetch CA Pick 3 data from lotteryusa.com
 */
async function fetchCAPick3FromLotteryUSA() {
  console.log('📋 Fetching CA Pick 3 from lotteryusa.com...');
  const draws = [];
  
  try {
    // Try to get the data from lotteryusa.com
    const url = 'https://www.lotteryusa.com/california/daily-3/';
    const resp = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(resp.data);
    
    // Try to find draw results table
    const rows = $('table tbody tr');
    rows.each((_, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 4) {
        const dateText = $(tds[0]).text().trim();
        const timeText = $(tds[1]).text().trim();
        const numbersText = $(tds[2]).text().trim();
        
        // Parse numbers
        const numbers = numbersText
          .split('')
          .map(n => parseInt(n.trim()))
          .filter(n => !isNaN(n));
          
        if (dateText && numbers.length === 3) {
          draws.push({
            date: dateText,
            time: timeText,
            numbers: numbers
          });
        }
      }
    });
    
    console.log(`✅ Found ${draws.length} CA Pick 3 draws from lotteryusa.com`);
  } catch (err) {
    console.log('⚠️ lotteryusa.com failed:', err.message);
  }
  
  return draws;
}

/**
 * Fetch CA Pick 4 data from lotteryusa.com
 */
async function fetchCAPick4FromLotteryUSA() {
  console.log('📋 Fetching CA Pick 4 from lotteryusa.com...');
  const draws = [];
  
  try {
    const url = 'https://www.lotteryusa.com/california/daily-4/';
    const resp = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(resp.data);
    
    // Try to find draw results table
    const rows = $('table tbody tr');
    rows.each((_, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 4) {
        const dateText = $(tds[0]).text().trim();
        const timeText = $(tds[1]).text().trim();
        const numbersText = $(tds[2]).text().trim();
        
        // Parse numbers
        const numbers = numbersText
          .split('')
          .map(n => parseInt(n.trim()))
          .filter(n => !isNaN(n));
          
        if (dateText && numbers.length === 4) {
          draws.push({
            date: dateText,
            time: timeText,
            numbers: numbers
          });
        }
      }
    });
    
    console.log(`✅ Found ${draws.length} CA Pick 4 draws from lotteryusa.com`);
  } catch (err) {
    console.log('⚠️ lotteryusa.com failed:', err.message);
  }
  
  return draws;
}

/**
 * Fetch CA Pick 3 and Pick 4 from theluckygene.com
 */
async function fetchFromTheLuckyGene() {
  console.log('📋 Fetching CA data from theluckygene.com...');
  const draws = { pick3: [], pick4: [] };
  
  try {
    // Try Daily 3
    const url3 = 'https://www.theluckygene.com/LotteryResults?gid=CaliforniaDaily3USGame';
    const resp3 = await axios.get(url3, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $3 = cheerio.load(resp3.data);
    
    // Look for numbers in the page
    $3('td').each((_, el) => {
      const text = $3(el).text().trim();
      // Check if it looks like a date or number
      if (text.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        // This might be a date
      } else if (text.match(/^\d{1,2}$/)) {
        // This might be a number
      }
    });
    
    // Try Daily 4
    const url4 = 'https://www.theluckygene.com/LotteryResults?gid=CaliforniaDaily4USGame';
    const resp4 = await axios.get(url4, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $4 = cheerio.load(resp4.data);
    
    console.log('⚠️ theluckygene.com data parsing needs more work');
  } catch (err) {
    console.log('⚠️ theluckygene.com failed:', err.message);
  }
  
  return draws;
}

/**
 * Save data to CSV file
 */
function saveToCSV(draws, filename, gameName) {
  if (!draws || draws.length === 0) {
    console.log(`⚠️ No data to save for ${filename}`);
    return;
  }
  
  const filePath = path.join(DATA_DIR, filename);
  const header = 'Date,Time,Game,Ball 1,Ball 2,Ball 3,Ball 4,Ball 5\n';
  const rows = draws.map(d => {
    const nums = d.numbers.map(n => n.toString().padStart(2, '0'));
    while (nums.length < 5) nums.push('');
    return `${d.date},${d.time || ''},${gameName},${nums.join(',')}`;
  }).join('\n');
  
  fs.writeFileSync(filePath, header + rows);
  console.log(`✅ Saved ${draws.length} records to ${filePath}`);
}

/**
 * Generate sample data if no data found
 */
function generateSampleData() {
  console.log('⚠️ Generating sample CA Pick 3 and Pick 4 data...');
  
  const pick3Draws = [];
  const pick4Draws = [];
  
  // Generate sample data for the last 30 days
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    // Pick 3 - two draws per day
    pick3Draws.push({
      date: dateStr,
      time: 'Midday',
      numbers: [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
    });
    pick3Draws.push({
      date: dateStr,
      time: 'Evening',
      numbers: [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
    });
    
    // Pick 4 - two draws per day
    pick4Draws.push({
      date: dateStr,
      time: 'Midday',
      numbers: [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
    });
    pick4Draws.push({
      date: dateStr,
      time: 'Evening',
      numbers: [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
    });
  }
  
  saveToCSV(pick3Draws, 'ca-pick3-sample.csv', 'Daily 3');
  saveToCSV(pick4Draws, 'ca-pick4-sample.csv', 'Daily 4');
  
  return { pick3Draws, pick4Draws };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting CA Pick 3/Pick 4 Data Fetch...\n');
  
  try {
    // Try multiple sources
    const [pick3FromLotteryUSA, pick4FromLotteryUSA] = await Promise.all([
      fetchCAPick3FromLotteryUSA(),
      fetchCAPick4FromLotteryUSA()
    ]);
    
    if (pick3FromLotteryUSA.length > 0) {
      saveToCSV(pick3FromLotteryUSA, 'ca-pick3.csv', 'Daily 3');
    }
    
    if (pick4FromLotteryUSA.length > 0) {
      saveToCSV(pick4FromLotteryUSA, 'ca-pick4.csv', 'Daily 4');
    }
    
    // If no data found, generate sample data
    if (pick3FromLotteryUSA.length === 0 && pick4FromLotteryUSA.length === 0) {
      console.log('\n⚠️ No live data found. Generating sample data...');
      generateSampleData();
    }
    
    console.log('\n✅ CA Pick 3/Pick 4 data fetch complete!');
    console.log(`   - Pick 3: ${pick3FromLotteryUSA.length} draws`);
    console.log(`   - Pick 4: ${pick4FromLotteryUSA.length} draws`);
    
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
