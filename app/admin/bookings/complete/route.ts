import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const bookingId = String(form.get("bookingId") || "");

  await fetch(new URL("/api/admin/bookings/complete", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });

  return NextResponse.redirect(new URL("/admin/bookings", req.url));
}
