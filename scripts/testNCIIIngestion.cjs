const { NCPick3Adapter } = require('../lib/ingestion/adapters/js/adapters/ncPick3Adapter.js');

(async () => {
    console.log('🚀 Starting NC Pick 3 historical data ingestion...');

    const adapter = new NCPick3Adapter();
    const result = await adapter.ingest();

    console.log('\n📈 Final Results:');
    console.log(`NC PICK 3:`);
    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  📊 Processed: ${result.totalProcessed}`);
    console.log(`  ✔️ Valid: ${result.validRecords}`);
    console.log(`  ❌ Invalid: ${result.invalidRecords}`);
    console.log(`  📥 Inserted: ${result.insertedRecords}`);
    if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`);
        result.errors.forEach((err, i) => {
            console.log(`    ${i + 1}. ${err}`);
        });
    }

    if (result.success) {
        console.log('\n✅ NC Pick 3 data ingested successfully!');
    } else {
        console.log('\n⚠️ NC Pick 3 ingestion had issues. Check errors above.');
    }
})();