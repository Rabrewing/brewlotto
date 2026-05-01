// /scripts/scrapeNC_Pick3.js
// BrewLotto AI — NC Pick 3 Scraper
// Updated to use V1 adapter architecture
// Last updated: 2026-03-18

import 'dotenv/config';
const { NCPick3Adapter } = require(path.resolve(__dirname, '../lib/ingestion/adapters/js/adapters/ncPick3Adapter.cjs'));

(async () => {
    try {
        const adapter = new NCPick3Adapter();
        const result = await adapter.ingest();
        
        console.log('\n📈 Final Results:');
        console.log(`NC PICK 3:`);
        console.log(`  ✅ Success: ${result.success}`);
        console.log(`  📊 Processed: ${result.totalProcessed}`);
        console.log(`  ✔️ Valid: ${result.validRecords}`);
        console.log(`  ❌ Invalid: ${result.invalidRecords}`);
        console.log(`  📥 Inserted: ${result.insertedRecords}`);
        
        if (result.success) {
            console.log('\n✅ NC Pick 3 history loaded via V1 adapter!');
        } else {
            console.log('\n⚠️ NC Pick 3 ingestion had issues.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Failed to ingest NC Pick 3 data:', error);
        process.exit(1);
    }
})();