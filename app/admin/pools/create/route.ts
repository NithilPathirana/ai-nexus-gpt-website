import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") || "");
  const totalSlots = Number(form.get("totalSlots") || 10);

  await fetch(new URL("/api/admin/pools/create", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, totalSlots }),
  });

  return NextResponse.redirect(new URL("/admin/pools", req.url));
}
