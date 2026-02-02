import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const fullName = String(form.get("fullName") || "");
  const nicNumber = String(form.get("nicNumber") || "");
  const consent = !!form.get("consent");

  const apiRes = await fetch(new URL("/api/kyc/submit", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName, nicNumber, consent }),
  });

  if (!apiRes.ok) return NextResponse.redirect(new URL("/kyc?error=failed", req.url));
  return NextResponse.redirect(new URL("/accounts", req.url));
}
