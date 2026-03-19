import 'dotenv/config';
import { NCPick4Adapter } from '../lib/ingestion/adapters/ncPick4Adapter.js';

(async () => {
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
    if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`);
        result.errors.forEach((err: string, i: number) => {
            console.log(`    ${i + 1}. ${err}`);
        });
    }

    if (result.success) {
        console.log('\n✅ NC Pick 4 data ingested successfully!');
    } else {
        console.log('\n⚠️ NC Pick 4 ingestion had issues. Check errors above.');
    }
})();