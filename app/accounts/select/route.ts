import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const poolId = String(form.get("poolId") || "");

  const apiRes = await fetch(new URL("/api/pools/select", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ poolId }),
  });

  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => ({}));
    const msg = encodeURIComponent(err.error || "Could not select pool");
    return NextResponse.redirect(new URL(`/accounts?error=${msg}`, req.url));
  }

  return NextResponse.redirect(new URL("/book", req.url));
}
