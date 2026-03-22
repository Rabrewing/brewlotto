// /scripts/testNCPick4Ingestion.ts
// Test script for NC Pick 4 adapter using TypeScript source

import { NCPick4Adapter } from '../lib/ingestion/adapters/ncPick4Adapter.js';

async function main() {
    console.log('🚀 Starting NC Pick 4 historical data ingestion...');

    const adapter = new NCPick4Adapter();
    const result = await adapter.ingest();

    console.log('\n📈 Final Results:');
    console.log(`NC PICK 4:`);
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
        console.log('\n✅ NC Pick 4 data ingested successfully!');
    } else {
        console.log('\n⚠️ NC Pick 4 ingestion had issues. Check errors above.');
    }
}

main().catch(console.error);