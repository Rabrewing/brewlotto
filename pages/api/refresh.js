/**
 * API Route: /api/refresh
 * Description: Triggers backend refreshDraws logic
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // Option 1: Spawn refreshDraws.js as a background job (if hosted in cloud)
        // Option 2: Invoke logic directly here (or trigger webhook)
        console.log('Simulating draw refresh…');

        return res.status(200).json({ message: '✅ Draws refreshed (simulated)' });
    } catch (e) {
        return res.status(500).json({ message: `❌ Refresh failed: ${e.message}` });
    }
}