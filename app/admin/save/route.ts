import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();

  const payload = {
    bookingDurationM: Number(form.get("bookingDurationM") || 15),
    dailyStartHour: Number(form.get("dailyStartHour") || 9),
    dailyEndHour: Number(form.get("dailyEndHour") || 18),
    bufferMinutes: Number(form.get("bufferMinutes") || 5),
    allowedDaysCsv: String(form.get("allowedDaysCsv") || "1,2,3,4,5,6"),
    zoomRecurringLink: String(form.get("zoomRecurringLink") || ""),
    graceAccessAllowed: !!form.get("graceAccessAllowed"),
  };

  await fetch(new URL("/api/admin/settings", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}
