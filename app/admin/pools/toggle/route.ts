import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const poolId = String(form.get("poolId") || "");

  await fetch(new URL("/api/admin/pools/toggle", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ poolId }),
  });

  return NextResponse.redirect(new URL("/admin/pools", req.url));
}
