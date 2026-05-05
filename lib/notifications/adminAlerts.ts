import type { SupabaseClient } from '@supabase/supabase-js';

type AdminAlertEmailInput = {
  alertEventId: string;
  alertKey: string;
  alertName?: string | null;
  alertType?: string | null;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  stateCode?: string | null;
  gameName?: string | null;
  emailRequired?: boolean;
  notificationChannels?: Record<string, unknown> | null;
  eventData?: Record<string, unknown> | null;
  alertStatus?: string | null;
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

async function getAlertRecipientEmail(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('brewcommand_settings')
    .select('setting_value')
    .eq('setting_key', 'alert_notification_recipient_email')
    .maybeSingle();

  if (error || !data?.setting_value) {
    return 'command@brewlotto.app';
  }

  const email = String(data.setting_value).trim().toLowerCase();
  return email || 'command@brewlotto.app';
}

function shouldSendAdminAlertEmail(input: AdminAlertEmailInput) {
  if (input.severity === 'critical') {
    return true;
  }

  if (input.emailRequired) {
    return true;
  }

  return input.notificationChannels?.email === true;
}

function buildAlertEmailHtml(input: AdminAlertEmailInput) {
  const stateLabel = input.stateCode || 'System-wide';
  const gameLabel = input.gameName || 'All games';
  const alertName = input.alertName || input.alertKey;
  const alertType = input.alertType || 'system';
  const eventDataJson = JSON.stringify(input.eventData || {}, null, 2);

  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fff;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="border:1px solid rgba(255,199,66,0.22);border-radius:24px;background:linear-gradient(145deg,rgba(30,20,13,0.94),rgba(8,8,10,0.98));padding:28px 24px;">
          <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#f0c46b;margin-bottom:10px;">BrewCommand Alert</div>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;color:#f7ddb3;">${input.title}</h1>
          <div style="margin:0 0 18px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.72);">
            ${input.message}
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
            <tr>
              <td style="border-radius:999px;background:#ffc742;padding:10px 18px;">
                <span style="color:#050505;font-size:13px;font-weight:700;">${input.severity.toUpperCase()}</span>
              </td>
            </tr>
          </table>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 18px;">
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:12px;background:rgba(255,255,255,0.03);">
              <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Alert</div>
              <div style="margin-top:6px;font-size:14px;color:#fff;">${alertName}</div>
            </div>
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:12px;background:rgba(255,255,255,0.03);">
              <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Type</div>
              <div style="margin-top:6px;font-size:14px;color:#fff;">${alertType}</div>
            </div>
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:12px;background:rgba(255,255,255,0.03);">
              <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">State / Game</div>
              <div style="margin-top:6px;font-size:14px;color:#fff;">${stateLabel} / ${gameLabel}</div>
            </div>
            <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:12px;background:rgba(255,255,255,0.03);">
              <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">BrewCommand</div>
              <div style="margin-top:6px;font-size:14px;color:#fff;">Review in the admin console</div>
            </div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Event data</div>
            <pre style="margin:10px 0 0;white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:18px;color:rgba(255,255,255,0.76);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${eventDataJson}</pre>
          </div>
          <div style="margin-top:18px;font-size:12px;line-height:20px;color:rgba(255,255,255,0.45);">
            This alert was sent to BrewCommand superadmins because it is marked important, critical, or email-worthy in the BrewLotto alert system.
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
    throw new Error(payload?.message || payload?.error?.message || 'Failed to send alert email');
  }

  return payload;
}

export async function deliverAdminAlertEmail(
  supabase: SupabaseClient,
  input: AdminAlertEmailInput,
) {
  if (!shouldSendAdminAlertEmail(input)) {
    return { skipped: true, reason: 'not-email-worthy' };
  }

  const config = getResendConfig();
  const recipient = await getAlertRecipientEmail(supabase);

  if (!config || !recipient) {
    return { skipped: true, reason: 'email-not-configured' };
  }

  const { data: alreadySent } = await supabase
    .from('alert_deliveries')
    .select('id')
    .eq('alert_event_id', input.alertEventId)
    .eq('channel', 'email')
    .in('status', ['sent', 'delivered'])
    .limit(1)
    .maybeSingle();

  if (alreadySent) {
    return { skipped: true, reason: 'already-sent' };
  }

  const subjectPrefix = input.severity === 'critical' ? '[CRITICAL]' : '[Alert]';
  const subject = `${subjectPrefix} ${input.title}`;
  const html = buildAlertEmailHtml(input);
  const text = [
    `BrewCommand Alert`,
    ``,
    `Title: ${input.title}`,
    `Message: ${input.message}`,
    `Severity: ${input.severity}`,
    `Alert: ${input.alertName || input.alertKey}`,
    `Type: ${input.alertType || 'system'}`,
    `State / Game: ${input.stateCode || 'System-wide'} / ${input.gameName || 'All games'}`,
  ].join('\n');

  const results = [];
  try {
    const resendResult = await sendResendEmail({
      apiKey: config.apiKey,
      fromEmail: config.fromEmail,
      fromName: config.fromName,
      to: recipient,
      subject,
      html,
      text,
    });

    await supabase.from('alert_deliveries').insert({
      alert_event_id: input.alertEventId,
      channel: 'email',
      recipient_identifier: recipient,
      status: 'sent',
      sent_at: new Date().toISOString(),
      delivered_at: null,
      error_message: null,
      retry_count: 0,
    });

    results.push({ recipient, status: 'sent' as const });
  } catch (error) {
    await supabase.from('alert_deliveries').insert({
      alert_event_id: input.alertEventId,
      channel: 'email',
      recipient_identifier: recipient,
      status: 'failed',
      sent_at: null,
      delivered_at: null,
      error_message: error instanceof Error ? error.message : 'Failed to send alert email',
      retry_count: 0,
    });

    results.push({
      recipient,
      status: 'failed' as const,
    });
  }

  const nowIso = new Date().toISOString();
  await supabase.from('alert_events').update({
    event_data: {
      ...(input.eventData || {}),
      email_last_sent_at: nowIso,
    },
    updated_at: nowIso,
  }).eq('id', input.alertEventId);

  return {
    skipped: false,
    recipients: results,
  };
}
