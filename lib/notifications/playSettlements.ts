import type { SupabaseClient } from '@supabase/supabase-js';

type SettlementNotificationInput = {
  userId: string;
  contactEmail: string | null;
  state: 'NC' | 'CA';
  gameLabel: string;
  drawDate: string;
  drawWindowLabel: string | null;
  playedNumbers: number[];
  officialNumbers: number[];
  matchCount: number;
  positionalMatchCount: number;
  bonusMatch: boolean;
  isWin: boolean;
  payoutTier: string | null;
  resultCode: string;
  payoutAmount: number | null;
  payoutLabel: string;
  payoutSummary: string;
  fireballActive?: boolean;
};

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.BREWCOMMAND_ALERT_FROM_EMAIL?.trim() || 'no-reply@brewlotto.app';
  const fromName = process.env.BREWCOMMAND_ALERT_FROM_NAME?.trim() || 'BrewLotto Alerts';

  if (!apiKey) {
    return null;
  }

  return { apiKey, fromEmail, fromName };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildResultSummary(input: SettlementNotificationInput) {
  const drawWindow = input.drawWindowLabel ? input.drawWindowLabel.replace(/_/g, ' ') : 'official draw';
  const resultSummary = input.isWin
    ? input.payoutSummary
    : input.matchCount > 0
      ? `Your pick settled with ${input.matchCount} matched number${input.matchCount === 1 ? '' : 's'}.`
      : 'Your pick settled without a winning match.';

  return {
    heading: input.isWin ? 'Winning result' : 'Settlement update',
    resultSummary,
    drawWindow,
  };
}

function buildSettlementEmailHtml(input: SettlementNotificationInput) {
  const summary = buildResultSummary(input);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://brewlotto.app').replace(/\/$/, '');
  const ctaUrl = `${appUrl}/notifications`;
  const playedNumbers = input.playedNumbers.join(' ');
  const officialNumbers = input.officialNumbers.join(' ');
  const bonusText = input.bonusMatch ? 'Bonus match: yes' : 'Bonus match: no';
  const fireballText = input.fireballActive ? 'Fireball: active' : 'Fireball: off';
  const prizeText = input.payoutAmount != null ? `$${input.payoutAmount.toFixed(2)}` : 'Pending';

  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fff;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="border:1px solid rgba(255,199,66,0.24);border-radius:24px;background:linear-gradient(145deg,rgba(30,20,13,0.96),rgba(8,8,10,0.99));padding:28px 24px;box-shadow:0 0 32px rgba(255,184,28,0.08);">
          <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#f0c46b;margin-bottom:8px;">BrewLotto Result</div>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;color:#f7ddb3;">${escapeHtml(summary.heading)}</h1>
          <div style="margin:0 0 18px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.72);">
            ${escapeHtml(summary.resultSummary)}
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Game</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(`${input.state} ${input.gameLabel}`)}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Your pick</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(playedNumbers || 'No numbers recorded')}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Official result</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(officialNumbers || 'No official numbers recorded')}</div>
            <div style="margin-top:6px;font-size:13px;line-height:20px;color:rgba(255,255,255,0.62);">${escapeHtml(bonusText)} · ${escapeHtml(prizeText)}</div>
            <div style="margin-top:6px;font-size:13px;line-height:20px;color:rgba(255,255,255,0.62);">${escapeHtml(fireballText)}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Settlement details</div>
            <div style="margin-top:6px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.76);">
              Draw date: ${escapeHtml(input.drawDate)}<br />
              Draw window: ${escapeHtml(summary.drawWindow)}<br />
              Match count: ${input.matchCount}<br />
              Positional match count: ${input.positionalMatchCount}<br />
              Fireball: ${input.fireballActive ? 'active' : 'off'}<br />
              Result code: ${escapeHtml(input.resultCode)}<br />
              Payout tier: ${escapeHtml(input.payoutLabel || input.payoutTier || 'Not awarded')}
            </div>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td style="border-radius:999px;background:#ffc742;padding:12px 20px;">
                <a href="${ctaUrl}" style="color:#050505;font-size:13px;font-weight:700;text-decoration:none;display:inline-block;">View in BrewLotto</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:18px;font-size:12px;line-height:20px;color:rgba(255,255,255,0.45);">
            BrewLotto keeps your result history and settlement details in the app so you can review them anytime.
          </div>
          <div style="margin-top:10px;font-size:11px;line-height:18px;color:rgba(255,255,255,0.30);">
            BrewLotto AI - Smart Picks. Sharper Odds.
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function buildPlayConfirmationEmailHtml(input: SettlementNotificationInput) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://brewlotto.app').replace(/\/$/, '');
  const ctaUrl = `${appUrl}/my-picks`;
  const drawWindow = input.drawWindowLabel ? input.drawWindowLabel.replace(/_/g, ' ') : 'official draw';
  const matchSummary = input.matchCount > 0
    ? `Your pick matched ${input.matchCount} number${input.matchCount === 1 ? '' : 's'} on this draw.`
    : 'Your pick nearly landed, and Brew wants to keep your history accurate.';
  const fireballNote = input.fireballActive ? ' Fireball was active on this play.' : '';

  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fff;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="border:1px solid rgba(255,199,66,0.24);border-radius:24px;background:linear-gradient(145deg,rgba(30,20,13,0.96),rgba(8,8,10,0.99));padding:28px 24px;box-shadow:0 0 32px rgba(255,184,28,0.08);">
          <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#f0c46b;margin-bottom:8px;">BrewLotto Play Confirmation</div>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;color:#f7ddb3;">If you played this draw, confirm it</h1>
          <div style="margin:0 0 18px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.72);">
            ${escapeHtml(matchSummary)}${escapeHtml(fireballNote)} BrewLotto is asking for a quick confirmation so your play history stays aligned with what you actually entered.
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Game</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(`${input.state} ${input.gameLabel}`)}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Draw context</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(input.drawDate)} · ${escapeHtml(drawWindow)}</div>
            <div style="margin-top:6px;font-size:13px;line-height:20px;color:rgba(255,255,255,0.62);">${input.fireballActive ? 'Fireball was active on this play.' : 'Fireball was not active on this play.'}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Your pick</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(input.playedNumbers.join(' ') || 'No numbers recorded')}</div>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td style="border-radius:999px;background:#ffc742;padding:12px 20px;">
                <a href="${ctaUrl}" style="color:#050505;font-size:13px;font-weight:700;text-decoration:none;display:inline-block;">Open My Picks</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:18px;font-size:12px;line-height:20px;color:rgba(255,255,255,0.45);">
            Confirming the play helps BrewLotto keep your strategy history accurate and makes future win tracking more reliable.
          </div>
          <div style="margin-top:10px;font-size:11px;line-height:18px;color:rgba(255,255,255,0.30);">
            BrewLotto AI - Smart Picks. Sharper Odds.
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

async function sendResendEmail(params: {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${params.fromName} <${params.fromEmail}>`,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error?.message || 'Failed to send settlement email');
  }

  return payload;
}

export async function sendPlaySettlementEmail(
  supabase: SupabaseClient,
  input: SettlementNotificationInput,
) {
  if (!input.contactEmail) {
    return { skipped: true, reason: 'no-contact-email' };
  }

  if (!input.isWin) {
    return { skipped: true, reason: 'not-a-winning-settlement' };
  }

  const prefsResult = await supabase
    .from('notification_preferences')
    .select('email_enabled, draw_results_enabled')
    .eq('user_id', input.userId)
    .maybeSingle();

  if (prefsResult.error) {
    throw new Error(prefsResult.error.message);
  }

  const prefs = prefsResult.data;
  if (prefs && (!prefs.email_enabled || !prefs.draw_results_enabled)) {
    return { skipped: true, reason: 'email-disabled' };
  }

  const config = getResendConfig();
  if (!config) {
    return { skipped: true, reason: 'email-not-configured' };
  }

  const subject = `[BrewLotto] Winning result for ${input.gameLabel}`;
  const html = buildSettlementEmailHtml(input);
  const text = [
    'BrewLotto Result',
    '',
    `Game: ${input.state} ${input.gameLabel}`,
    `Draw date: ${input.drawDate}`,
    `Draw window: ${input.drawWindowLabel || 'official draw'}`,
    `Your pick: ${input.playedNumbers.join(' ')}`,
    `Official result: ${input.officialNumbers.join(' ')}`,
    `Match count: ${input.matchCount}`,
    `Positional match count: ${input.positionalMatchCount}`,
    `Bonus match: ${input.bonusMatch ? 'yes' : 'no'}`,
    `Fireball: ${input.fireballActive ? 'active' : 'off'}`,
    `Result code: ${input.resultCode}`,
    `Payout tier: ${input.payoutLabel || input.payoutTier || 'not awarded'}`,
    '',
    'Open BrewLotto to view the full result history.',
  ].join('\n');

  await sendResendEmail({
    apiKey: config.apiKey,
    fromEmail: config.fromEmail,
    fromName: config.fromName,
    to: input.contactEmail,
    subject,
    html,
    text,
  });

  return { skipped: false };
}

export async function sendPlayConfirmationNudge(
  supabase: SupabaseClient,
  input: SettlementNotificationInput,
) {
  const prefsResult = await supabase
    .from('notification_preferences')
    .select('email_enabled, draw_results_enabled, pick_reminders_enabled')
    .eq('user_id', input.userId)
    .maybeSingle();

  if (prefsResult.error) {
    throw new Error(prefsResult.error.message);
  }

  const prefs = prefsResult.data;
  const shouldEmail = Boolean(
    input.contactEmail &&
    prefs &&
    prefs.email_enabled &&
    (prefs.pick_reminders_enabled || prefs.draw_results_enabled),
  );

  const notificationTitle = input.matchCount >= 2
    ? 'Your pick came close'
    : 'Confirm your play';
  const fireballSentence = input.fireballActive ? ' Fireball was active on this play.' : '';
  const notificationBody = input.matchCount > 0
    ? `Your ${input.gameLabel} numbers matched ${input.matchCount} number${input.matchCount === 1 ? '' : 's'} on ${input.drawDate}.${fireballSentence} If you played this draw, confirm it in BrewLotto so your history stays accurate.`
    : `If you played this ${input.gameLabel} draw, confirm it in BrewLotto so your history stays accurate.${fireballSentence}`;

  if (input.userId) {
    const { error: insertError } = await supabase.from('user_notifications').insert({
      user_id: input.userId,
      type: 'pick_reminder',
      title: notificationTitle,
      body: notificationBody,
      cta_label: 'Open My Picks',
      cta_url: `${(process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://brewlotto.app').replace(/\/$/, '')}/my-picks`,
      priority: input.matchCount >= 2 ? 'high' : 'normal',
      metadata: {
        source: 'play_confirmation_prompt',
        game_label: input.gameLabel,
        state: input.state,
        draw_date: input.drawDate,
        draw_window_label: input.drawWindowLabel,
        match_count: input.matchCount,
        positional_match_count: input.positionalMatchCount,
        bonus_match: input.bonusMatch,
        fireball_active: Boolean(input.fireballActive),
      },
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  if (!shouldEmail) {
    return { skipped: true, reason: 'email-disabled-or-unavailable' };
  }

  const config = getResendConfig();
  if (!config) {
    return { skipped: true, reason: 'email-not-configured' };
  }

  const subject = `[BrewLotto] Confirm your ${input.gameLabel} play`;
  const html = buildPlayConfirmationEmailHtml(input);
  const text = [
    'BrewLotto Play Confirmation',
    '',
    `Game: ${input.state} ${input.gameLabel}`,
    `Draw date: ${input.drawDate}`,
    `Draw window: ${input.drawWindowLabel || 'official draw'}`,
    `Your pick: ${input.playedNumbers.join(' ')}`,
    `Match count: ${input.matchCount}`,
    `Bonus match: ${input.bonusMatch ? 'yes' : 'no'}`,
    `Fireball: ${input.fireballActive ? 'active' : 'off'}`,
    '',
    'Open BrewLotto My Picks to confirm the play and keep your history accurate.',
  ].join('\n');

  await sendResendEmail({
    apiKey: config.apiKey,
    fromEmail: config.fromEmail,
    fromName: config.fromName,
    to: input.contactEmail!,
    subject,
    html,
    text,
  });

  return { skipped: false };
}
