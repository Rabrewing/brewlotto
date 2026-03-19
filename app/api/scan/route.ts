import { NextResponse } from 'next/server';
import { runAuditScan } from "@/lib/server/scanEngine"; // Adjusted path

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dir = searchParams.get('dir') || 'src';
        const scan = runAuditScan(dir);

        const flagged = scan.refactor_candidates.length;
        const deprecated = scan.deprecated_modules.length;
        const unused = scan.unused_files.length;

        const summary = `🧠 Scan complete. ${flagged} refactor candidates, ${deprecated} deprecated, ${unused} unused.`;

        return NextResponse.json({
            success: true,
            summary,
            metrics: {
                refactor: flagged,
                deprecated,
                unused
            },
            snapshot: scan
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: "Scan failed", details: e.message }, { status: 500 });
    }
}
