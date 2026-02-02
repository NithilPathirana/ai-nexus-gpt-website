import { NextResponse } from "next/server";
import { computeSlotsForDate } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ slots: [] });
  const slots = await computeSlotsForDate(date);
  return NextResponse.json({ slots });
}
