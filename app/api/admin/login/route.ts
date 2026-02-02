import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = String(body?.password || "");

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Server missing ADMIN_PASSWORD env var." },
        { status: 500 }
      );
    }

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    // httpOnly cookie so JS can't read it
    res.cookies.set("nexus_admin", "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (e) {
    console.error("ADMIN LOGIN ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
