import env from "../config/env.js";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const COPY = {
  verify: {
    subject: "Verify your TypeC account",
    intro: "Welcome to TypeC! Use this code to verify your email and finish creating your account.",
  },
  login: {
    subject: "Your TypeC sign-in code",
    intro: "Someone is signing in to your TypeC account. If it's you, use this code to finish signing in.",
  },
  reset: {
    subject: "Reset your TypeC password",
    intro: "We got a request to reset your TypeC password. Use this code to choose a new one.",
  },
  "enable-2fa": {
    subject: "Turn on two-factor authentication",
    intro: "Use this code to turn on two-factor authentication for your TypeC account.",
  },
};

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendMail({ to, toName, subject, html, text, replyTo }) {
  if (!env.brevo.apiKey) {
    console.log(`\n[mail] to ${to}\n[mail] ${subject}\n${text}\n`);
    return;
  }

  const payload = {
    sender: { email: env.brevo.fromEmail, name: env.brevo.fromName },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent: html,
    textContent: text,
  };
  if (replyTo) payload.replyTo = { email: replyTo };

  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: {
      "api-key": env.brevo.apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo rejected the email (${res.status}): ${detail.slice(0, 300)}`);
  }
}

export function sendCodeEmail(user, code, purpose) {
  const copy = COPY[purpose];
  const name = escapeHtml(user.username);

  const html = `
  <div style="background:#0b0f18;padding:32px 16px;font-family:'JetBrains Mono',Consolas,monospace;color:#e5e7eb">
    <div style="max-width:440px;margin:0 auto;background:#12161f;border:1px solid #1f2937;border-radius:12px;padding:28px">
      <div style="font-weight:700;letter-spacing:2px;color:#ffffff">TYPE<span style="color:#00e572">C</span></div>
      <p style="margin:24px 0 8px;color:#ffffff">Hi ${name},</p>
      <p style="margin:0 0 24px;color:#9ca3af;line-height:1.6">${copy.intro}</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:10px;color:#00e572;background:#0b0e14;border:1px solid rgba(0,229,114,0.3);border-radius:8px;padding:16px;text-align:center">${code}</div>
      <p style="margin:24px 0 0;color:#6b7280;font-size:12px;line-height:1.6">The code expires in 10 minutes. If you didn't ask for this, you can ignore this email — your account is safe.</p>
    </div>
  </div>`;

  const text = `Hi ${user.username},\n\n${copy.intro}\n\nYour code: ${code}\n\nIt expires in 10 minutes. If you didn't ask for this, ignore this email.`;

  return sendMail({ to: user.email, toName: user.username, subject: copy.subject, html, text });
}
