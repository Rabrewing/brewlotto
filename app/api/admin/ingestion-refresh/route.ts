/**
 * POST /api/admin/ingestion-refresh - Trigger a manual ingestion refresh
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { NextRequest, NextResponse } from 'next/server';
import { requireBrewCommandRequest } from '@/lib/auth/brewcommand';

const execFileAsync = promisify(execFile);

type RefreshTarget =
  | 'all'
  | 'pick3'
  | 'pick4'
  | 'cash5'
  | 'powerball'
  | 'mega_millions';

const REFRESH_COMMANDS: Record<RefreshTarget, { command: string; args: string[]; label: string }> = {
  all: {
    command: 'node',
    args: ['scripts/ingestionJob.js'],
    label: 'Full ingestion job',
  },
  pick3: {
    command: 'node',
    args: ['scripts/scrapeNC_Pick3.js'],
    label: 'NC Pick 3 refresh',
  },
  pick4: {
    command: 'node',
    args: ['scripts/scrapeNC_Pick4.js'],
    label: 'NC Pick 4 refresh',
  },
  cash5: {
    command: 'node',
    args: ['scripts/scrapeNC_Cash5.js'],
    label: 'NC Cash 5 refresh',
  },
  powerball: {
    command: 'node',
    args: ['scripts/scrapePowerball.js'],
    label: 'Powerball refresh',
  },
  mega_millions: {
    command: 'node',
    args: ['scripts/scrapeMega.js'],
    label: 'Mega Millions refresh',
  },
};

export async function POST(request: NextRequest) {
  try {
    const unauthorizedResponse = await requireBrewCommandRequest(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const body = await request.json().catch(() => ({}));
    const target = (body?.target || 'all') as RefreshTarget;
    const commandConfig = REFRESH_COMMANDS[target];

    if (!commandConfig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Unsupported refresh target.',
          },
        },
        { status: 400 }
      );
    }

    const { stdout, stderr } = await execFileAsync(commandConfig.command, commandConfig.args, {
      cwd: process.cwd(),
      timeout: 120000,
      maxBuffer: 1024 * 1024,
    });

    return NextResponse.json({
      success: true,
      data: {
        target,
        label: commandConfig.label,
        stdout: stdout?.trim() || null,
        stderr: stderr?.trim() || null,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: error instanceof Error ? error.message : 'Manual ingestion refresh failed.',
        },
      },
      { status: 500 }
    );
  }
}
