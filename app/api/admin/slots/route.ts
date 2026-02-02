import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const ok = cookieStore.get("nexus_admin")?.value === "1";
  return ok;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slots = await prisma.slot.findMany({
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json({ ok: true, slots });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const startsAt = String(body?.startsAt || "").trim();
  const endsAt = String(body?.endsAt || "").trim();

  if (!startsAt || !endsAt) {
    return NextResponse.json(
      { error: "Missing startsAt or endsAt." },
      { status: 400 }
    );
  }

  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
  }

  if (end <= start) {
    return NextResponse.json({ error: "endsAt must be after startsAt." }, { status: 400 });
  }

  // Optional: prevent overlapping slots (simple check)
  const overlap = await prisma.slot.findFirst({
    where: {
      isActive: true,
      AND: [
        { startsAt: { lt: end } },
        { endsAt: { gt: start } },
      ],
    },
  });

  if (overlap) {
    return NextResponse.json(
      { error: "This overlaps an existing active slot." },
      { status: 409 }
    );
  }

  const created = await prisma.slot.create({
    data: {
      startsAt: start,
      endsAt: end,
      isActive: true,
    },
  });

  return NextResponse.json({ ok: true, slot: created });
}
