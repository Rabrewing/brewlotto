// Test script to check NCEL Powerball page structure
import 'dotenv/config';
import axios from 'axios';
import { load } from 'cheerio';

(async () => {
    try {
        const url = 'https://nclottery.com/powerball-past-draws?month=3&year=2026';
        console.log(`Fetching: ${url}`);
        
        const resp = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = load(resp.data);
        
        // Check for tables
        const tables = $('table');
        console.log(`Found ${tables.length} tables`);
        
        // Check for specific elements
        const pastDrawsTable = $('.past-draws-table');
        console.log(`Found ${pastDrawsTable.length} .past-draws-table elements`);
        
        // Try to find rows
        const rows = $('table tbody tr');
        console.log(`Found ${rows.length} table rows`);
        
        // Show first few rows
        rows.each((i, el) => {
            if (i < 3) {
                const tds = $(el).find('td');
                console.log(`Row ${i}: ${tds.length} cells`);
                tds.each((j, td) => {
                    console.log(`  Cell ${j}: ${$(td).text().trim().substring(0, 50)}`);
                });
            }
        });
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
})();