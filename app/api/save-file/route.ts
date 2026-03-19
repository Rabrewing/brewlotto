import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    const { path: filePath, content } = await req.json();

    if (!filePath || typeof content !== 'string') {
        return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    }

    try {
        const target = path.resolve(process.cwd(), filePath);
        fs.writeFileSync(target, content, 'utf-8');
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error('[SAVE ERROR]', err.message);
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
}
