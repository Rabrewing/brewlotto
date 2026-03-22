// /scripts/scrapeCA_Fantasy5.js
// BrewLotto AI — CA Fantasy 5 Historical Scraper for lotteryextreme.com
// Uses draw numbers to get historical data

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';

const DATA_DIR = './data/ca';
const DELAY_MS = 50; // Be respectful to the server

const GAME = {
  name: 'Fantasy 5',
  baseUrl: 'https://www.lotteryextreme.com/california/fantasy5-detailed_results',
  drawCount: 5,
  file: 'ca-fantasy5.csv',
  latestDraw: 11823, // Known latest draw from the website
  startDraw: 1       // Will scrape backwards from latest
};

async function scrapeDraw(drawId) {
  // Estimate date based on draw number
  // Fantasy 5 has 1 draw per day
  // Latest draw #11823 is on 2026-03-21
  const refDate = new Date('2026-03-21');
  const daysBack = GAME.latestDraw - drawId;
  const drawDate = new Date(refDate.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const dateStr = drawDate.toISOString().split('T')[0];
  
  // URL pattern from the website: fantasy5-detailed_results(2026-03-21).php
  const url = `${GAME.baseUrl}(${dateStr}).php`;
  
  try {
    const resp = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    
    if (resp.status === 404 || resp.status === 410) return null;
    
    const $ = load(resp.data);
    
    // Extract numbers from the display
    // Look for ul.displayball li elements
    const numbers = [];
    
    // Primary method: look for ul.displayball li elements
    $('ul.displayball li').each((i, el) => {
      const num = parseInt($(el).text().trim());
      if (!isNaN(num) && num >= 1 && num <= 39) {
        numbers.push(num);
      }
    });
    
    // If that doesn't work, try alternative selectors
    if (numbers.length !== GAME.drawCount) {
      // Clear and try another method
      numbers.length = 0;
      
      // Look for numbers in table cells
      $('table.results td').each((i, el) => {
        const text = $(el).text().trim();
        const num = parseInt(text);
        if (!isNaN(num) && num >= 1 && num <= 39) {
          numbers.push(num);
        }
      });
    }
    
    if (numbers.length !== GAME.drawCount) {
      return null;
    }
    
    // Sort numbers in ascending order (standard lottery format)
    numbers.sort((a, b) => a - b);
    
    return {
      draw_date: dateStr,
      draw_id: drawId,
      numbers
    };
    
  } catch (e) {
    return null;
  }
}

async function scrapeFantasy5(maxDraws = null) {
  console.log(`\n🎯 Scraping CA ${GAME.name}...`);
  
  const startDraw = GAME.latestDraw;
  const endDraw = maxDraws ? Math.max(1, GAME.latestDraw - maxDraws + 1) : 1;
  
  console.log(`   Draw range: ${startDraw} to ${endDraw}`);
  console.log(`   Total draws to scrape: ${startDraw - endDraw + 1}`);
  
  const draws = [];
  let consecutiveFails = 0;
  let lastProgress = -1;
  
  for (let drawId = startDraw; drawId >= endDraw; drawId--) {
    const result = await scrapeDraw(drawId);
    
    if (result) {
      draws.push(result);
      consecutiveFails = 0;
      
      // Log every 100 draws
      if (draws.length % 100 === 0) {
        console.log(`   Progress: ${draws.length} draws collected (Draw #${drawId})`);
      }
    } else {
      consecutiveFails++;
      
      // Log failure
      if (consecutiveFails === 1) {
        console.log(`   ⚠️ Failed to get draw #${drawId}`);
      }
    }
    
    // Progress reporting
    const progress = Math.floor((startDraw - drawId) / (startDraw - endDraw) * 100);
    if (progress > lastProgress && progress % 10 === 0) {
      console.log(`   Progress: ${progress}% (${draws.length} draws)`);
      lastProgress = progress;
    }
    
    // Stop if too many consecutive failures (we've reached the start or broken data)
    if (consecutiveFails > 10) {
      console.log(`   Stopping at draw ${drawId} - too many consecutive failures`);
      break;
    }
    
    // Delay between requests to be respectful
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
  
  console.log(`   ✅ Total draws scraped: ${draws.length}`);
  
  // Sort by date (oldest first)
  draws.sort((a, b) => new Date(a.draw_date) - new Date(b.draw_date));
  
  // Save to CSV
  const csvHeader = 'draw_date,draw_id,n1,n2,n3,n4,n5\n';
  const csvData = draws.map(d => {
    return `${d.draw_date},${d.draw_id},${d.numbers.join(',')}`;
  }).join('\n');
  
  const csvFile = path.join(DATA_DIR, GAME.file);
  fs.writeFileSync(csvFile, csvHeader + csvData);
  console.log(`   💾 Saved to: ${csvFile}`);
  
  return draws;
}

async function main() {
  const args = process.argv.slice(2);
  const countArg = args[0] ? parseInt(args[0]) : null;
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (countArg) {
    console.log(`Scraping last ${countArg} draws...`);
    await scrapeFantasy5(countArg);
  } else {
    console.log('Usage: node scrapeCA_Fantasy5.js [max_draws]');
    console.log('Example: node scrapeCA_Fantasy5.js 5000');
    console.log('Default: scraping last 1000 draws (about 3 years)');
    await scrapeFantasy5(1000);
  }
  
  console.log('\n✅ CA Fantasy 5 scraper complete!');
}

main();