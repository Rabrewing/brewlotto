#!/usr/bin/env node

/**
 * Update AGENTS.md with state expansion plans and data sources
 * This script adds California data sources and updates the roadmap
 */

const fs = require('fs');
const path = require('path');

const AGENTS_PATH = path.join(__dirname, '..', 'AGENTS.md');

/**
 * Update AGENTS.md with California data info
 */
function updateAgentsMd() {
  let content = fs.readFileSync(AGENTS_PATH, 'utf8');
  
  // Find the end of the "Supported Lottery Games" section and add California info
  const gamesSection = content.match(/### Supported Lottery Games \(V1 Launch\)[\s\S]*?---/);
  if (gamesSection) {
    const updatedSection = `### Supported Lottery Games (V1 Launch)

Initial implementation must support:

- **Pick 3** (3 digits, 0-9) — NC, CA
- **Pick 4** (4 digits, 0-9) — NC, CA
- **Cash 5** (5 numbers, 1-39/43) — NC (Cash 5), CA (Fantasy 5)
- **Powerball** (5 + Powerball, 1-69 + 1-26) — Multi-State
- **MegaMillions** (5 + MegaBall, 1-70 + 1-25) — Multi-State

Launch states: North Carolina (NC) and California (CA) only.

---

## Data Sources

### California Lottery Data
- **Official API**: https://www.calottery.com/api/
- **Historical CSV**: Available at lotto-8.com
- **Games**: Daily 3 (Pick 3), Daily 4 (Pick 4), Fantasy 5 (Cash 5)

### North Carolina Lottery Data
- **Official API**: https://nclottery.com/api/
- **Historical CSV**: Available in /data/nc/
- **Games**: Pick 3, Pick 4, Cash 5

### Multi-State Games
- **Powerball & Mega Millions**: https://www.powerball.com/ & https://www.megamillions.com/

---

`;
    
    content = content.replace(gamesSection[0], updatedSection);
    fs.writeFileSync(AGENTS_PATH, content);
    console.log('✅ Updated AGENTS.md with California data info');
  } else {
    console.log('⚠️ Could not find games section in AGENTS.md');
  }
}

/**
 * Create a data sources documentation file
 */
function createDataSourcesDoc() {
  const docPath = path.join(__dirname, '..', 'brewdocs', 'v1', 'data-sources.md');
  const doc = `# Lottery Data Sources

This document contains information about the official and unofficial sources for lottery draw data.

## California Lottery

### Official Sources
- **Website**: https://www.calottery.com/
- **API**: Limited public API available
- **Draw Schedule**: Daily (midday and evening)

### Game Data
| Game | Name | Numbers | Draw Time |
|------|------|---------|-----------|
| Daily 3 | Pick 3 | 3 digits (0-9) | 1:29 PM & 6:59 PM PT |
| Daily 4 | Pick 4 | 4 digits (0-9) | 1:29 PM & 6:59 PM PT |
| Fantasy 5 | Cash 5 | 5 numbers (1-39) | 6:45 PM PT |

### Historical Data Sources
- **Lotto-8.com**: https://www.lotto-8.com/usa/
  - Daily 3: https://www.lotto-8.com/usa/listlto3.asp
  - Daily 4: https://www.lotto-8.com/usa/listlto4.asp
  - Fantasy 5: https://www.lotto-8.com/usa/listltoFT5.asp
- **LotteryUSA**: https://www.lotteryusa.com/california/

## North Carolina Lottery

### Official Sources
- **Website**: https://nclottery.com/
- **API**: https://nclottery.com/api/
- **Draw Schedule**: Daily (midday and evening)

### Game Data
| Game | Name | Numbers | Draw Time |
|------|------|---------|-----------|
| Pick 3 | Pick 3 | 3 digits (0-9) | 2:59 PM & 11:22 PM ET |
| Pick 4 | Pick 4 | 4 digits (0-9) | 2:59 PM & 11:22 PM ET |
| Cash 5 | Cash 5 | 5 numbers (1-43) | 11:22 PM ET |

## Multi-State Games

### Powerball
- **Website**: https://www.powerball.com/
- **Draw Schedule**: Wednesday & Saturday at 10:59 PM ET
- **Format**: 5 numbers (1-69) + Powerball (1-26)

### Mega Millions
- **Website**: https://www.megamillions.com/
- **Draw Schedule**: Tuesday & Friday at 11:00 PM ET
- **Format**: 5 numbers (1-70) + Mega Ball (1-25)

## API Alternatives

If official APIs are insufficient, these services provide lottery data:

1. **Lottery Results Feed** - https://www.lotteryresultsfeed.com/
2. **Downtack API** - https://downtack.com/en/us-lottery-api.html
3. **APIVerve** - https://docs.apiverve.com/ref/lottery

## Data Storage Structure

Current data directory structure:
\`\`\`
/data/
├── ca/                    # California historical data
│   ├── ca-pick3.csv
│   ├── ca-pick4.csv
│   └── ca-fantasy5.csv
├── nc/                    # North Carolina historical data
│   ├── pick3.csv
│   ├── pick4.csv
│   └── cash5.csv
└── multi-state/
    ├── powerball.csv
    └── mega-millions.csv
\`\`\`
`;

  fs.writeFileSync(docPath, doc);
  console.log('✅ Created data-sources.md');
}

/**
 * Update package.json scripts
 */
function updatePackageJson() {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  // Add new scripts
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['fetch-ca-data'] = 'node scripts/fetchCAData.js';
  pkg.scripts['ingest-all'] = 'node scripts/ingestAllData.js';
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ Updated package.json scripts');
}

/**
 * Create ingest all data script
 */
function createIngestAllScript() {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'ingestAllData.js');
  const script = `#!/usr/bin/env node

/**
 * Ingest all lottery data into Supabase
 * Run this script to load historical data into the database
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = new Client(supabaseUrl, supabaseKey);

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    rows.push(row);
  }
  
  return rows;
}

/**
 * Get game ID from game name and state
 */
async function getGameId(gameName, stateCode) {
  const { data, error } = await supabase
    .from('lottery_games')
    .select('id')
    .eq('name', gameName)
    .eq('state_code', stateCode)
    .single();
  
  if (error) {
    console.error(\`Error fetching game ID for \${gameName}:\`, error.message);
    return null;
  }
  
  return data?.id;
}

/**
 * Insert draw data
 */
async function insertDraws(draws, gameId) {
  if (!gameId || draws.length === 0) return;
  
  const formattedDraws = draws.map(draw => ({
    game_id: gameId,
    draw_date: draw.Date,
    draw_datetime: new Date(draw.Date).toISOString(),
    numbers: [
      parseInt(draw['Ball 1']),
      parseInt(draw['Ball 2']),
      parseInt(draw['Ball 3']),
      draw['Ball 4'] ? parseInt(draw['Ball 4']) : null,
      draw['Ball 5'] ? parseInt(draw['Ball 5']) : null
    ].filter(n => n !== null),
    bonus_numbers: [],
    result_status: 'official'
  }));
  
  const { error } = await supabase
    .from('lottery_draws')
    .insert(formattedDraws);
  
  if (error) {
    console.error('Error inserting draws:', error.message);
    return false;
  }
  
  return true;
}

/**
 * Main ingest function
 */
async function ingestGameData(stateCode, gameKey, csvFile) {
  console.log(\`\\n📥 Ingesting \${stateCode} \${gameKey}...\`);
  
  const csvPath = path.join(__dirname, '..', 'data', stateCode.toLowerCase(), csvFile);
  if (!fs.existsSync(csvPath)) {
    console.log(\`⚠️ File not found: \${csvPath}\`);
    return;
  }
  
  const rows = parseCSV(csvPath);
  console.log(\`  Found \${rows.length} draws in CSV\`);
  
  // Map game names
  const gameNames = {
    'ca-pick3': 'Daily 3',
    'ca-pick4': 'Daily 4',
    'ca-fantasy5': 'Fantasy 5',
    'nc-pick3': 'Pick 3',
    'nc-pick4': 'Pick 4',
    'nc-cash5': 'Cash 5'
  };
  
  const gameName = gameNames[gameKey];
  const gameId = await getGameId(gameName, stateCode);
  
  if (!gameId) {
    console.log(\`⚠️ Game ID not found for \${gameName}\`);
    return;
  }
  
  const success = await insertDraws(rows, gameId);
  if (success) {
    console.log(\`  ✅ Inserted \${rows.length} draws\`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting lottery data ingestion...\');
  
  try {
    // California data
    await ingestGameData('CA', 'ca-pick3', 'ca-pick3.csv');
    await ingestGameData('CA', 'ca-pick4', 'ca-pick4.csv');
    await ingestGameData('CA', 'ca-fantasy5', 'ca-fantasy5.csv');
    
    // North Carolina data
    await ingestGameData('NC', 'nc-pick3', 'pick3.csv');
    await ingestGameData('NC', 'nc-pick4', 'pick4.csv');
    await ingestGameData('NC', 'nc-cash5', 'cash5.csv');
    
    console.log('\\n✅ Data ingestion complete!');
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
`;

  fs.writeFileSync(scriptPath, script);
  console.log('✅ Created ingestAllData.js');
}

// Execute all tasks
updateAgentsMd();
createDataSourcesDoc();
updatePackageJson();
createIngestAllScript();

console.log('\\n✅ All setup tasks complete!');
