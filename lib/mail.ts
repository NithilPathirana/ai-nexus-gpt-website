import nodemailer from "nodemailer";

export function mailer() {
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;

  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  const from = process.env.MAIL_FROM || "Nexus GPT <AI.Nexus.store@gmail.com>";
  const transport = mailer();
  await transport.sendMail({ from, to, subject, html });
}
