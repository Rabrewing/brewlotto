import { NextResponse } from 'next/server';
import { fetchStats } from "../../../../utils/fetchStats"; // Adjusted path

export async function GET(request: Request, context: { params: { game: string } }) {
    const { game } = context.params;
    const { searchParams } = new URL(request.url);

    if (!game) {
        return NextResponse.json({ error: "Missing game param" }, { status: 400 });
    }

    try {
        const stats = await fetchStats(game, Object.fromEntries(searchParams));
        return NextResponse.json(stats, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Stats fetch failed" }, { status: 500 });
    }
}
