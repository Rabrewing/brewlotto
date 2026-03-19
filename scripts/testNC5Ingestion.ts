import 'dotenv/config';
import { NCCash5Adapter } from '../lib/ingestion/adapters/ncCash5Adapter.js';

(async () => {
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
    if (result.errors.length > 0) {
        console.log(`  ⚠️ Errors: ${result.errors.length}`);
        result.errors.forEach((err: string, i: number) => {
            console.log(`    ${i + 1}. ${err}`);
        });
    }

    if (result.success) {
        console.log('\n✅ NC Cash 5 data ingested successfully!');
    } else {
        console.log('\n⚠️ NC Cash 5 ingestion had issues. Check errors above.');
    }
})();