import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const userId = String(form.get("userId") || "");
  const payherePaymentLink = String(form.get("payherePaymentLink") || "");

  await fetch(new URL("/api/admin/payments/send", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ userId, payherePaymentLink }),
  });

  return NextResponse.redirect(new URL("/admin/payments", req.url));
}
