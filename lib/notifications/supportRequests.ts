import type { SupabaseClient } from '@supabase/supabase-js';

type SupportRequestStatus = 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';

type SupportRequestNotificationInput = {
  requestId: string;
  userId?: string | null;
  contactEmail: string | null;
  category: string;
  subject: string;
  message: string;
  page?: string | null;
  status: SupportRequestStatus;
  adminNotes?: string | null;
};

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.BREWCOMMAND_ALERT_FROM_EMAIL?.trim() || 'no-reply@brewlotto.app';
  const fromName = process.env.BREWCOMMAND_ALERT_FROM_NAME?.trim() || 'BrewLotto Support';

  if (!apiKey) {
    return null;
  }

  return { apiKey, fromEmail, fromName };
}

function buildStatusEmailHtml(input: SupportRequestNotificationInput) {
  const statusLabel = input.status.replace(/_/g, ' ');
  const supportLink = 'https://brewlotto.app/support';

  return `<!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#fff;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="border:1px solid rgba(255,199,66,0.22);border-radius:24px;background:linear-gradient(145deg,rgba(30,20,13,0.96),rgba(8,8,10,0.99));padding:28px 24px;box-shadow:0 0 32px rgba(255,184,28,0.08);">
          <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#f0c46b;margin-bottom:8px;">BrewLotto Support</div>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;color:#f7ddb3;">Your support request has been updated</h1>
          <div style="margin:0 0 18px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.72);">
            We wanted to let you know your BrewLotto support request is now <strong>${statusLabel}</strong>.
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:16px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Subject</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${input.subject}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);margin-bottom:16px;">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Status</div>
            <div style="margin-top:6px;font-size:15px;color:#fff;">${statusLabel}</div>
          </div>
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:14px;background:rgba(0,0,0,0.26);">
            <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Details</div>
            <div style="margin-top:6px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.76);white-space:pre-wrap;">${input.adminNotes || 'We have updated your request and will continue to track it from BrewCommand.'}</div>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr>
              <td style="border-radius:999px;background:#ffc742;padding:12px 20px;">
                <a href="${supportLink}" style="color:#050505;font-size:13px;font-weight:700;text-decoration:none;display:inline-block;">Open Support</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:18px;font-size:12px;line-height:20px;color:rgba(255,255,255,0.45);">
            If you need to add more context, reply through BrewLotto support again from the Systems menu.
          </div>
          <div style="margin-top:10px;font-size:11px;line-height:18px;color:rgba(255,255,255,0.30);">
            BrewLotto AI - Smart Picks. Sharper Odds.
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function buildStatusNotificationBody(input: SupportRequestNotificationInput) {
  return [
    `Your BrewLotto support request has been marked ${input.status.replace(/_/g, ' ')}.`,
    input.adminNotes ? `BrewCommand note: ${input.adminNotes}` : null,
    `Open BrewLotto Support to continue the conversation.`,
  ]
    .filter(Boolean)
    .join(' ');
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
    throw new Error(payload?.message || payload?.error?.message || 'Failed to send support status email');
  }

  return payload;
}

export async function sendSupportRequestStatusEmail(
  _supabase: SupabaseClient,
  input: SupportRequestNotificationInput,
) {
  if (!input.contactEmail) {
    return { skipped: true, reason: 'no-contact-email' };
  }

  if (input.status !== 'resolved') {
    return { skipped: true, reason: 'status-not-email-worthy' };
  }

  const config = getResendConfig();
  if (!config) {
    return { skipped: true, reason: 'email-not-configured' };
  }

  const subject = `[BrewLotto Support] ${input.subject}`;
  const html = buildStatusEmailHtml(input);
  const text = [
    `BrewLotto Support`,
    ``,
    `Status: ${input.status}`,
    `Subject: ${input.subject}`,
    `Category: ${input.category}`,
    `Page: ${input.page || 'Unknown'}`,
    ``,
    input.adminNotes || 'We have updated your support request.',
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

  if (input.userId) {
    await _supabase.from('user_notifications').insert({
      user_id: input.userId,
      type: 'system',
      title: 'Support request resolved',
      body: buildStatusNotificationBody(input),
      cta_label: 'Open Support',
      cta_url: 'https://brewlotto.app/support',
      priority: 'normal',
      metadata: {
        request_id: input.requestId,
        category: input.category,
        status: input.status,
        source: 'support_resolution',
      },
    });
  }

  return { skipped: false };
}
