import { prisma } from "@/lib/prisma";

function toAllowedDays(csv: string) {
  return csv
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => n >= 1 && n <= 7);
}

export async function getAdminSettings() {
  let s = await prisma.adminSetting.findFirst();
  if (!s) {
    s = await prisma.adminSetting.create({
      data: {
        zoomRecurringLink: process.env.ZOOM_RECURRING_LINK || "",
        graceAccessAllowed: true,
      },
    });
  }
  return s;
}

export async function computeSlotsForDate(dateISO: string) {
  const settings = await getAdminSettings();
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");

  const jsDay = date.getDay();
  const day = jsDay === 0 ? 7 : jsDay; // Sun=7
  const allowedDays = toAllowedDays(settings.allowedDaysCsv);
  if (!allowedDays.includes(day)) return [];

  const start = new Date(dateISO + "T00:00:00.000Z");
  const end = new Date(dateISO + "T23:59:59.999Z");

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: start, lte: end }, status: "BOOKED" },
  });

  const bookedTimes = new Set(bookings.map((b) => b.date.toISOString().slice(11, 16)));

  const slots: string[] = [];
  const dur = settings.bookingDurationM;
  const buf = settings.bufferMinutes;

  let t = settings.dailyStartHour * 60;
  const endM = settings.dailyEndHour * 60;

  while (t + dur <= endM) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    const time = `${hh}:${mm}`;
    if (!bookedTimes.has(time)) slots.push(time);
    t += dur + buf;
  }

  return slots;
}
