import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
      from: process.env.MAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        await sendEmail(
          identifier,
          "Your Nexus GPT login link",
          `
          <div style="font-family:Arial;line-height:1.6;padding:16px">
            <h2>Nexus GPT</h2>
            <p>Click this link to sign in:</p>
            <p><a href="${url}">${url}</a></p>
            <p style="color:#667; font-size:13px">If you didn’t request this, ignore this email.</p>
          </div>
          `
        );
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (dbUser) {
        const sub = await prisma.subscription.findUnique({ where: { userId: dbUser.id } });
        if (!sub) await prisma.subscription.create({ data: { userId: dbUser.id } });
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
