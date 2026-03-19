// /scripts/scrapeNC_Cash5.js
// BrewLotto AI — NC Cash 5 Scraper
// Updated to use V1 adapter architecture
// Last updated: 2026-03-18

import 'dotenv/config';
import { NCCash5Adapter } from '../lib/ingestion/adapters/ncCash5Adapter.js';

(async () => {
    try {
        const adapter = new NCCash5Adapter();
        const result = await adapter.ingest();
        
        console.log('\n📈 Final Results:');
        console.log(`NC CASH 5:`);
        console.log(`  ✅ Success: ${result.success}`);
        console.log(`  📊 Processed: ${result.totalProcessed}`);
        console.log(`  ✔️ Valid: ${result.validRecords}`);
        console.log(`  ❌ Invalid: ${result.invalidRecords}`);
        console.log(`  📥 Inserted: ${result.insertedRecords}`);
        
        if (result.success) {
            console.log('\n✅ NC Cash 5 history loaded via V1 adapter!');
        } else {
            console.log('\n⚠️ NC Cash 5 ingestion had issues.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Failed to ingest NC Cash 5 data:', error);
        process.exit(1);
    }
})();