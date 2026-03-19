import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
        return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
    }

    try {
        const safePath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(safePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = fs.readFileSync(safePath, 'utf-8');
        return new NextResponse(content, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    } catch (err: any) {
        console.error('File load error:', err.message);
        return NextResponse.json({ error: 'Error loading file' }, { status: 500 });
    }
}
