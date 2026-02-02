import { NextResponse } from "next/server";
import { listPoolsWithAvailability } from "@/lib/slots";

export async function GET() {
  const pools = await listPoolsWithAvailability();
  return NextResponse.json({ pools });
}
