import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'Full';
    console.log(`📝 API Triggered: generate-report?type=${type}`);

    try {
        // Dynamic import of a CJS module in an ESM context.
        // This might require specific Node.js configurations or a wrapper.
        // For now, assuming it works or will be addressed during testing.
        const { default: generateReport } = await import('../../../../scripts/generateMergeReadinessReport.cjs');
        const result = generateReport();

        if (!result || typeof result !== 'object') {
            console.error('⚠️ generateReport() returned null or malformed:', result);
            return NextResponse.json({
                error: 'Report generation returned invalid structure',
            }, { status: 500 });
        }

        const {
            outputPath = '/docs/merge/MergeReadinessReport.md',
            filesScanned = null,
            reportHash = null,
            timestamp = new Date().toISOString(),
        } = result;

        console.log('✅ Report metadata:', { outputPath, reportHash, filesScanned });

        return NextResponse.json({
            message: 'Report generated successfully',
            path: outputPath,
            filesScanned,
            reportHash,
            timestamp,
        }, { status: 200 });
    } catch (err: any) {
        console.error('❌ Internal error during report generation:', err);
        return NextResponse.json({
            error: 'Internal error while generating report',
            message: err.message || 'Unknown failure',
        }, { status: 500 });
    }
}
