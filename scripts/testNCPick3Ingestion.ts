// /scripts/testNCPick3Ingestion.ts
// Test script for NC Pick 3 adapter using TypeScript source

import { NCPick3Adapter } from '../lib/ingestion/adapters/ncPick3Adapter.js';

async function main() {
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
    console.log(`  ⏭️ Skipped: ${result.skippedRecords}`);
    console.log(`  ⏱️ Duration: ${result.duration}ms`);
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