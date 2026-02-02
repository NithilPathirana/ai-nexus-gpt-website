import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.redirect(new URL("/api/auth/signin", req.url));

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.redirect(new URL("/dashboard", req.url));

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();

  await prisma.policyAcceptance.upsert({
    where: { userId: user.id },
    update: { termsVersion: "v1", privacyVersion: "v1", usageVersion: "v1", refundsVersion: "v1", ipAddress: ip },
    create: { userId: user.id, termsVersion: "v1", privacyVersion: "v1", usageVersion: "v1", refundsVersion: "v1", ipAddress: ip },
  });

  return NextResponse.redirect(new URL("/kyc", req.url));
}
