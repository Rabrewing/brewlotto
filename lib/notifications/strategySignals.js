const ALERTABLE_STRATEGY_KEYS = new Set([
  'hot_cold',
  'momentum',
  'poisson_basic',
  'advanced_scoring',
  'confidence_bands',
]);

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.BREWCOMMAND_ALERT_FROM_EMAIL?.trim() || 'no-reply@brewlotto.app';
  const fromName = process.env.BREWCOMMAND_ALERT_FROM_NAME?.trim() || 'BrewLotto Alerts';

  if (!apiKey) {
    return null;
  }

  return { apiKey, fromEmail, fromName };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNumberList(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 'N/A';
  }

  return numbers.join(', ');
}

function computeStrategySignalSnapshot(draws, primaryCount) {
  const baseWindow = draws.slice(0, 120);
  const recentWindow = draws.slice(0, 30);

  const baseFreq = new Map();
  const recentFreq = new Map();
  const lastSeen = new Map();

  let totalBaseHits = 0;
  let totalRecentHits = 0;

  for (let index = 0; index < baseWindow.length; index += 1) {
    const primaries = Array.isArray(baseWindow[index]?.primary_numbers)
      ? baseWindow[index].primary_numbers.filter((value) => typeof value === 'number')
      : [];

    for (const number of primaries) {
      baseFreq.set(number, (baseFreq.get(number) || 0) + 1);
      totalBaseHits += 1;
      if (!lastSeen.has(number)) {
        lastSeen.set(number, index);
      }
    }

    if (index < recentWindow.length) {
      for (const number of primaries) {
        recentFreq.set(number, (recentFreq.get(number) || 0) + 1);
        totalRecentHits += 1;
      }
    }
  }

  const pool = new Set([...baseFreq.keys(), ...recentFreq.keys()]);
  if (pool.size === 0) {
    return null;
  }

  let maxBaseFreq = 0;
  let maxRecentFreq = 0;
  for (const number of pool) {
    maxBaseFreq = Math.max(maxBaseFreq, baseFreq.get(number) || 0);
    maxRecentFreq = Math.max(maxRecentFreq, recentFreq.get(number) || 0);
  }

  let maxDelta = 0;
  const scored = [];
  for (const number of pool) {
    const base = baseFreq.get(number) || 0;
    const recent = recentFreq.get(number) || 0;
    const expectedInRecent = base * (recentWindow.length / Math.max(baseWindow.length, 1));
    const delta = recent - expectedInRecent;
    const hotBase = maxBaseFreq > 0 ? base / maxBaseFreq : 0;
    const hotRecent = maxRecentFreq > 0 ? recent / maxRecentFreq : 0;
    maxDelta = Math.max(maxDelta, delta);
    scored.push({
      number,
      hotBase,
      hotRecent,
      delta,
      lastSeen: lastSeen.has(number) ? lastSeen.get(number) : 120,
    });
  }

  if (maxDelta === 0) {
    maxDelta = 1;
  }

  const hotNumbers = scored
    .map((entry) => ({
      number: entry.number,
      score: 0.45 * entry.hotBase + 0.35 * entry.hotRecent + 0.20 * (entry.delta / maxDelta),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, primaryCount)
    .map((entry) => entry.number);

  const coldNumbers = scored
    .map((entry) => ({
      number: entry.number,
      score:
        0.45 * (1 - (maxBaseFreq > 0 ? (baseFreq.get(entry.number) || 0) / maxBaseFreq : 0)) +
        0.35 * (1 - (maxRecentFreq > 0 ? (recentFreq.get(entry.number) || 0) / maxRecentFreq : 0)) +
        0.20 * (Math.min(entry.lastSeen, 120) / 120),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, primaryCount)
    .map((entry) => entry.number);

  const recentAppearanceRate = totalRecentHits / Math.max(recentWindow.length * primaryCount, 1);
  const baseAppearanceRate = totalBaseHits / Math.max(baseWindow.length * primaryCount, 1);
  let momentumPercent = 0;
  if (baseAppearanceRate > 0) {
    momentumPercent = Math.round(((recentAppearanceRate / baseAppearanceRate) - 1) * 100);
    momentumPercent = Math.max(0, Math.min(100, momentumPercent));
  }

  return {
    hotNumbers,
    coldNumbers,
    momentumPercent,
  };
}

function buildStrategySignalHtml({
  stateCode,
  gameLabel,
  drawDate,
  drawWindowLabel,
  momentumPercent,
  hotNumbers,
  coldNumbers,
  ctaUrl,
}) {
  const drawWindow = drawWindowLabel ? drawWindowLabel.replace(/_/g, ' ') : 'official draw';
  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fff;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="border:1px solid rgba(255,199,66,0.24);border-radius:24px;background:linear-gradient(145deg,rgba(30,20,13,0.96),rgba(8,8,10,0.99));padding:28px 24px;box-shadow:0 0 32px rgba(255,184,28,0.08);">
          <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#f0c46b;margin-bottom:8px;">Brew AI Signal</div>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;color:#f7ddb3;">A live strategy shift is building</h1>
          <div style="margin:0 0 18px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.72);">
            Brew spotted a meaningful change on <strong>${escapeHtml(stateCode)} ${escapeHtml(gameLabel)}</strong> after the latest ${escapeHtml(drawWindow)}.
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Momentum</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${momentumPercent}%</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Hot numbers</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(formatNumberList(hotNumbers))}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:14px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Cold numbers</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${escapeHtml(formatNumberList(coldNumbers))}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Why it matters</div>
            <div style="margin-top:6px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.76);">
              Brew is surfacing this as a strategy signal, not a promise. Open BrewLotto to review the live context and your saved strategies.
            </div>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td style="border-radius:999px;background:#ffc742;padding:12px 20px;">
                <a href="${ctaUrl}" style="color:#050505;font-size:13px;font-weight:700;text-decoration:none;display:inline-block;">Open Brew Alerts</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:18px;font-size:12px;line-height:20px;color:rgba(255,255,255,0.45);">
            You can manage these alerts from the notification center.
          </div>
          <div style="margin-top:10px;font-size:11px;line-height:18px;color:rgba(255,255,255,0.30);">
            BrewLotto AI - Smart Picks. Sharper Odds.
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

async function sendResendEmail(params) {
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
    throw new Error(payload?.message || payload?.error?.message || 'Failed to send strategy signal email');
  }

  return payload;
}

export async function sendStrategySignalNotifications(supabase, input) {
  const config = getResendConfig();
  if (!config) {
    return { skipped: true, reason: 'email-not-configured' };
  }

  const alertableStrategiesResult = await supabase
    .from('strategy_registry')
    .select('id, strategy_key')
    .in('strategy_key', [...ALERTABLE_STRATEGY_KEYS])
    .eq('is_active', true);

  if (alertableStrategiesResult.error) {
    throw new Error(alertableStrategiesResult.error.message);
  }

  const alertableStrategyIds = (alertableStrategiesResult.data || []).map((row) => row.id).filter(Boolean);
  if (alertableStrategyIds.length === 0) {
    return { skipped: true, reason: 'no-alertable-strategies' };
  }

  const savedStrategiesResult = await supabase
    .from('user_saved_strategies')
    .select('user_id')
    .in('strategy_id', alertableStrategyIds)
    .eq('is_favorite', true);

  if (savedStrategiesResult.error) {
    throw new Error(savedStrategiesResult.error.message);
  }

  const userIds = [...new Set((savedStrategiesResult.data || []).map((row) => row.user_id).filter(Boolean))];
  if (userIds.length === 0) {
    return { skipped: true, reason: 'no-recipients' };
  }

  const signal = computeStrategySignalSnapshot(input.draws, input.primaryCount);
  if (!signal || signal.momentumPercent < 20) {
    return { skipped: true, reason: 'signal-not-strong-enough' };
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://brewlotto.app').replace(/\/$/, '');
  const ctaUrl = `${appUrl}/notifications`;
  const signalType = signal.momentumPercent >= 35 ? 'momentum_surge' : 'momentum_shift';
  const signalKey = [
    input.stateCode,
    input.gameKey,
    input.drawId,
    signalType,
    signal.momentumPercent,
    signal.hotNumbers.join('-'),
    signal.coldNumbers.join('-'),
  ].join(':');
  const title = `Brew spotted a live strategy shift on ${input.gameLabel}`;
  const body = `Momentum is at ${signal.momentumPercent}% on ${input.stateCode} ${input.gameLabel}. Hot numbers: ${formatNumberList(signal.hotNumbers)}. Cold numbers: ${formatNumberList(signal.coldNumbers)}.`;
  const reason =
    signalType === 'momentum_surge'
      ? `Recent draws show a strong momentum surge for ${input.stateCode} ${input.gameLabel}.`
      : `Recent draws show a meaningful momentum shift for ${input.stateCode} ${input.gameLabel}.`;
  const html = buildStrategySignalHtml({
    stateCode: input.stateCode,
    gameLabel: input.gameLabel,
    drawDate: input.drawDate,
    drawWindowLabel: input.drawWindowLabel,
    momentumPercent: signal.momentumPercent,
    hotNumbers: signal.hotNumbers,
    coldNumbers: signal.coldNumbers,
    ctaUrl,
  });
  const text = [
    'Brew AI Signal',
    '',
    `Game: ${input.stateCode} ${input.gameLabel}`,
    `Draw date: ${input.drawDate}`,
    `Draw window: ${input.drawWindowLabel || 'official draw'}`,
    `Momentum: ${signal.momentumPercent}%`,
    `Hot numbers: ${formatNumberList(signal.hotNumbers)}`,
    `Cold numbers: ${formatNumberList(signal.coldNumbers)}`,
    '',
    'Open BrewLotto to review the strategy signal and saved strategies.',
  ].join('\n');

  let notificationsCreated = 0;
  let emailsSent = 0;
  const recipients = [];

  for (const userId of userIds) {
    const { data: preferenceRow, error: preferenceError } = await supabase
      .from('notification_preferences')
      .select('email_enabled, draw_results_enabled')
      .eq('user_id', userId)
      .maybeSingle();

    if (preferenceError) {
      throw new Error(preferenceError.message);
    }

    if (!preferenceRow?.draw_results_enabled) {
      continue;
    }

    const { data: existingNotifications, error: existingError } = await supabase
      .from('user_notifications')
      .select('metadata, created_at')
      .eq('user_id', userId)
      .eq('type', 'system')
      .order('created_at', { ascending: false })
      .limit(10);

    if (existingError) {
      throw new Error(existingError.message);
    }

    const alreadySent = (existingNotifications || []).some((notification) => {
      const metadata = notification?.metadata && typeof notification.metadata === 'object'
        ? notification.metadata
        : {};
      return metadata?.source === 'strategy_signal' && metadata?.signal_key === signalKey;
    });

    if (alreadySent) {
      continue;
    }

    const { error: insertError } = await supabase.from('user_notifications').insert({
      user_id: userId,
      type: 'system',
      title,
      body,
      cta_label: 'Open Brew Alerts',
      cta_url: ctaUrl,
      priority: signal.momentumPercent >= 35 ? 'high' : 'normal',
      metadata: {
        source: 'strategy_signal',
        signal_key: signalKey,
        signal_type: signalType,
        signal_reason: reason,
        state: input.stateCode,
        game_key: input.gameKey,
        game_label: input.gameLabel,
        draw_id: input.drawId,
        draw_date: input.drawDate,
        draw_window_label: input.drawWindowLabel,
        momentum_percent: signal.momentumPercent,
        hot_numbers: signal.hotNumbers,
        cold_numbers: signal.coldNumbers,
        contact_email: authUser.user.email,
        eligible_strategy_keys: [...ALERTABLE_STRATEGY_KEYS],
      },
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    notificationsCreated += 1;

    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
    if (authUserError || !authUser?.user?.email) {
      continue;
    }

    recipients.push(authUser.user.email);

    if (!preferenceRow?.email_enabled) {
      continue;
    }

    await sendResendEmail({
      apiKey: config.apiKey,
      fromEmail: config.fromEmail,
      fromName: config.fromName,
      to: authUser.user.email,
      subject: `[BrewLotto] ${input.gameLabel} strategy shift`,
      html,
      text,
    });

    emailsSent += 1;
  }

  return {
    skipped: false,
    notificationsCreated,
    emailsSent,
    recipients,
    momentumPercent: signal.momentumPercent,
    signalType,
  };
}
