import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    const { file, patch, approvedBy } = await req.json();

    if (!file || !patch?.after) {
        return NextResponse.json({ error: 'Missing file or patch content' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), file);

    try {
        fs.writeFileSync(fullPath, patch.after, 'utf-8');

        const ledgerPath = path.join(process.cwd(), '.brew-refactor-activity/refactorLedger.json');
        let ledger: any[] = [];

        if (fs.existsSync(ledgerPath)) {
            const ledgerContent = fs.readFileSync(ledgerPath, 'utf-8');
            ledger = JSON.parse(ledgerContent);
        }

        ledger.push({
            file,
            approvedBy,
            timestamp: new Date().toISOString(),
            summary: `Fix applied by Brew Da AI`,
        });

        fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
        fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

        return NextResponse.json({ status: 'success', file }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
