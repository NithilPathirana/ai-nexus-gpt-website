import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignSlotToUser } from "@/lib/slots";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { poolId } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const pol = await prisma.policyAcceptance.findUnique({ where: { userId: user.id } });
  if (!pol) return NextResponse.json({ error: "Policies not accepted" }, { status: 428 });

  const kyc = await prisma.kycRecord.findUnique({ where: { userId: user.id } });
  if (!kyc) return NextResponse.json({ error: "KYC not submitted" }, { status: 428 });

  const slot = await assignSlotToUser(user.id, poolId);
  return NextResponse.json({ ok: true, slot });
}
