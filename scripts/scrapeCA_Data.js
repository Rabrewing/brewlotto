// /scripts/scrapeCA_Data.js
// BrewLotto AI — CA Daily 3/Daily 4 Scraper for lotteryextreme.com
// Iterates by draw ID to get historical data

import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';

const DATA_DIR = './data/ca';
const DELAY_MS = 30;

const GAMES = {
  daily3: {
    name: 'Daily 3',
    baseUrl: 'https://www.lotteryextreme.com/california/daily3-detailed_results',
    drawCount: 3,
    file: 'ca-daily3.csv',
    latestDraw: 20924, // Known from listing
    startDraw: 1       // Will scrape backwards from latest
  },
  daily4: {
    name: 'Daily 4',
    baseUrl: 'https://www.lotteryextreme.com/california/daily4-detailed_results',
    drawCount: 4,
    file: 'ca-daily4.csv',
    latestDraw: 6510,
    startDraw: 1
  }
};

function dateToDrawId(date, latestDraw = 20924, latestDate = new Date()) {
  // Estimate draw ID based on date
  // CA Daily 3 has ~2 draws per day
  const daysDiff = Math.floor((latestDate - date) / (1000 * 60 * 60 * 24));
  return Math.max(1, latestDraw - (daysDiff * 2));
}

async function scrapeDraw(gameKey, drawId) {
  const game = GAMES[gameKey];
  
  // Use a reference date for estimation
  // Daily 3 has 2 draws/day, Daily 4 has 1 draw/day
  const drawsPerDay = gameKey === 'daily3' ? 2 : 1;
  const refDate = new Date('2026-03-16');
  const daysBack = Math.floor((game.latestDraw - drawId) / drawsPerDay);
  const estimatedDate = new Date(refDate.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const dateStr = estimatedDate.toISOString().split('T')[0];
  
  const url = `${game.baseUrl}(${dateStr}_${drawId})`;
  
  try {
    const resp = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    
    if (resp.status === 404 || resp.status === 410) return null;
    
    const $ = load(resp.data);
    
    // Extract actual date from title
    const title = $('title').text();
    const dateMatch = title.match(/(\w+) (\d+), (\d{4})/);
    
    if (!dateMatch) return null;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const month = (monthNames.indexOf(dateMatch[1]) + 1).toString().padStart(2, '0');
    const day = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3];
    const drawDate = `${year}-${month}-${day}`;
    
    // Extract numbers
    const numbers = [];
    $('ul.displayball li').each((i, el) => {
      if (i < game.drawCount) {
        const num = $(el).text().trim();
        if (/^\d$/.test(num)) {
          numbers.push(parseInt(num));
        }
      }
    });
    
    if (numbers.length !== game.drawCount) return null;
    
    return {
      draw_date: drawDate,
      draw_id: drawId,
      numbers,
      fireball: ''
    };
    
  } catch (e) {
    return null;
  }
}

async function scrapeGame(gameKey, maxDraws = null) {
  const game = GAMES[gameKey];
  console.log(`\n🎯 Scraping CA ${game.name}...`);
  
  // Always start from latest and go backwards
  const startDraw = game.latestDraw;
  // If maxDraws specified, end at (latest - maxDraws), otherwise go to 1
  const endDraw = maxDraws ? Math.max(1, game.latestDraw - maxDraws + 1) : 1;
  
  console.log(`   Draw range: ${startDraw} to ${endDraw}`);
  
  const draws = [];
  let consecutiveFails = 0;
  let lastProgress = -1;
  
  for (let drawId = startDraw; drawId >= endDraw; drawId--) {
    const result = await scrapeDraw(gameKey, drawId);
    
    if (result) {
      draws.push(result);
      consecutiveFails = 0;
    } else {
      consecutiveFails++;
    }
    
    // Progress reporting
    const progress = Math.floor((startDraw - drawId) / startDraw * 100);
    if (progress > lastProgress && progress % 10 === 0) {
      console.log(`   Progress: ${progress}% (${draws.length} draws)`);
      lastProgress = progress;
    }
    
    // Stop if too many consecutive failures (we've reached the start)
    if (consecutiveFails > 100) {
      console.log(`   Stopping at draw ${drawId} - reached beginning`);
      break;
    }
    
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
  
  console.log(`   ✅ Total draws: ${draws.length}`);
  
  // Save to CSV
  const csvHeader = gameKey === 'daily3' 
    ? 'draw_date,draw_id,n1,n2,n3,fireball\n'
    : 'draw_date,draw_id,n1,n2,n3,n4,fireball\n';
  
  const csvData = draws.map(d => {
    const nums = d.numbers.join(',');
    return `${d.draw_date},${d.draw_id || ''},${nums},${d.fireball || ''}`;
  }).join('\n');
  
  const csvFile = path.join(DATA_DIR, game.file);
  fs.writeFileSync(csvFile, csvHeader + csvData);
  console.log(`   💾 Saved to: ${csvFile}`);
  
  return draws;
}

async function main() {
  const args = process.argv.slice(2);
  const gameArg = args[0];
  const countArg = args[1] ? parseInt(args[1]) : null;
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (gameArg === 'daily3') {
    await scrapeGame('daily3', countArg);
  } else if (gameArg === 'daily4') {
    await scrapeGame('daily4', countArg);
  } else if (gameArg === 'both') {
    await scrapeGame('daily3', countArg);
    await scrapeGame('daily4', countArg);
  } else {
    console.log('Usage: node scrapeCA_Data.js [daily3|daily4|both] [max_draws]');
    console.log('Example: node scrapeCA_Data.js both 5000');
    console.log('Default: scraping last 5000 draws for both games');
    await scrapeGame('daily3', 5000);
    await scrapeGame('daily4', 5000);
  }
  
  console.log('\n✅ CA scraper complete!');
}

main();
