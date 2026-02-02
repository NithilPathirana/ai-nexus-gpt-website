import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const date = String(form.get("date") || "");
  const time = String(form.get("time") || "");

  const apiRes = await fetch(new URL("/api/booking/create", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ date, time }),
  });

  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => ({}));
    const msg = encodeURIComponent(err.error || "Booking failed");
    return NextResponse.redirect(new URL(`/book?error=${msg}`, req.url));
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
