// /scripts/runAudit.js
import { runAudit } from './drawHistoryAudit.js';

(async () => {
    console.log('🔍 Draw History Audit\n────────────────────────────');
    const results = await runAudit();

    for (const { game, count, missingDates } of results) {
        console.log(`🧾 ${game.toUpperCase()} has ${count} missing draw dates`);
        if (count > 0) {
            console.log(missingDates.join(', '));
        }
    }

    console.log('\n✅ Audit complete. Investigate gaps if any are reported.');
})();