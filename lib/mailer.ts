import nodemailer from "nodemailer";

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  const t = getTransport();
  if (!t) return { ok: false, error: "SMTP not configured" };

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@ai-nexus-gpt.com";
  await t.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text });
  return { ok: true };
}
