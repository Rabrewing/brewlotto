// /scripts/testNCPick3Ingestion.mjs
// ESM test script for NC Pick 3 adapter using dynamic import

async function main() {
    console.log('🚀 Starting NC Pick 3 historical data ingestion...');
    
    // Dynamic import to handle CJS module
    const ncModule = await import('../lib/ingestion/adapters/js/adapters/ncPick3Adapter.js');
    const NCPick3Adapter = ncModule.NCPick3Adapter || ncModule.default?.NCPick3Adapter;
    
    if (!NCPick3Adapter) {
        console.error('❌ Could not find NCPick3Adapter export');
        console.log('Available exports:', Object.keys(ncModule));
        process.exit(1);
    }

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
}

main().catch(console.error);