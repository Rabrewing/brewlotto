// /scripts/testNCCash5Ingestion.ts
// Test script for NC Cash 5 adapter using TypeScript source

import { NCCash5Adapter } from '../lib/ingestion/adapters/ncCash5Adapter.js';

async function main() {
    console.log('🚀 Starting NC Cash 5 historical data ingestion...');

    const adapter = new NCCash5Adapter();
    const result = await adapter.ingest();

    console.log('\n📈 Final Results:');
    console.log(`NC CASH 5:`);
    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  📊 Processed: ${result.totalProcessed}`);
    console.log(`  ✔️ Valid: ${result.validRecords}`);
    console.log(`  ❌ Invalid: ${result.invalidRecords}`);
    console.log(`  📥 Inserted: ${result.insertedRecords}`);
    console.log(`  ⏭️ Skipped: ${result.skippedRecords}`);
    console.log(`  ⏱️ Duration: ${result.duration}ms`);
    if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`);
        result.errors.slice(0, 5).forEach((err, i) => {
            console.log(`    ${i + 1}. ${err}`);
        });
        if (result.errors.length > 5) {
            console.log(`    ... and ${result.errors.length - 5} more errors`);
        }
    }

    if (result.success) {
        console.log('\n✅ NC Cash 5 data ingested successfully!');
    } else {
        console.log('\n⚠️ NC Cash 5 ingestion had issues. Check errors above.');
    }
}

main().catch(console.error);