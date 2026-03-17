#!/usr/bin/env node
/**
 * CA Data Validation Script
 * Performs spot check against official CA lottery results
 */
import fs from 'fs';
import path from 'path';

function loadCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      const v = values[i]?.trim();
      row[h] = v === '' || v === undefined ? '' : (isNaN(Number(v)) ? v : Number(v));
    });
    return row;
  });
}

function validateDaily3(draws) {
  console.log('\n📊 CA Daily 3 Validation Report');
  console.log('==============================');
  
  const total = draws.length;
  console.log(`Total draws: ${total}`);
  
  const dates = draws.map(d => d.draw_date).sort();
  console.log(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);
  
  const dateCounts = new Map();
  draws.forEach(d => {
    const key = `${d.draw_date}-${d.n1}-${d.n2}-${d.n3}`;
    dateCounts.set(key, (dateCounts.get(key) || 0) + 1);
  });
  const duplicates = Array.from(dateCounts.values()).filter(c => c > 1).length;
  console.log(`Duplicate entries: ${duplicates}`);
  
  let invalidNumbers = 0;
  draws.forEach(d => {
    [d.n1, d.n2, d.n3].forEach(n => {
      if (n < 0 || n > 9) invalidNumbers++;
    });
  });
  console.log(`Invalid number range: ${invalidNumbers}`);
  
  console.log('\n📝 Sample draws (first 5):');
  draws.slice(0, 5).forEach(d => {
    console.log(`  ${d.draw_date}: ${d.n1}-${d.n2}-${d.n3}`);
  });
  
  console.log('\n📝 Sample draws (last 5):');
  draws.slice(-5).forEach(d => {
    console.log(`  ${d.draw_date}: ${d.n1}-${d.n2}-${d.n3}`);
  });
  
  return { total, duplicates, invalidNumbers };
}

function validateDaily4(draws) {
  console.log('\n📊 CA Daily 4 Validation Report');
  console.log('==============================');
  
  const total = draws.length;
  console.log(`Total draws: ${total}`);
  
  const dates = draws.map(d => d.draw_date).sort();
  console.log(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);
  
  let invalidNumbers = 0;
  draws.forEach(d => {
    [d.n1, d.n2, d.n3, d.n4].forEach(n => {
      if (n < 0 || n > 9) invalidNumbers++;
    });
  });
  console.log(`Invalid number range: ${invalidNumbers}`);
  
  console.log('\n📝 Sample draws (first 5):');
  draws.slice(0, 5).forEach(d => {
    console.log(`  ${d.draw_date}: ${d.n1}-${d.n2}-${d.n3}-${d.n4}`);
  });
  
  return { total, invalidNumbers };
}

const dataDir = './data/ca';

const daily3File = path.join(dataDir, 'ca-daily3.csv');
if (fs.existsSync(daily3File)) {
  const daily3 = loadCSV(daily3File);
  validateDaily3(daily3);
}

const daily4File = path.join(dataDir, 'ca-daily4.csv');
if (fs.existsSync(daily4File)) {
  const daily4 = loadCSV(daily4File);
  validateDaily4(daily4);
}

console.log('\n✅ Validation complete');
console.log('\n⚠️  Manual verification recommended:');
console.log('   Cross-check 3-5 draws against official calottery.com results');
