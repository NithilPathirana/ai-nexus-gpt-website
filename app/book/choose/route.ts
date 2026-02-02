import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const date = String(form.get("date") || "");
  return NextResponse.redirect(new URL(`/book/select?date=${encodeURIComponent(date)}`, req.url));
}
