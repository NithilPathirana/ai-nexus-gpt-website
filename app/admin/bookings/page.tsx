"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BookingRow = {
  id: string;
  createdAt: string;
  timezone: string | null;
  lead: {
    email: string;
    phone: string;
    country: string;
    timezone: string;
  };
  slot: {
    startsAt: string;
    endsAt: string;
  };
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function waLink(phone: string) {
  // WhatsApp expects digits only (no spaces, no +)
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export default function AdminBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [onlyUpcoming, setOnlyUpcoming] = useState(true);

  const apiUrl = useMemo(() => {
    const q = onlyUpcoming ? "?upcoming=1" : "";
    return `/api/admin/bookings${q}`;
  }, [onlyUpcoming]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
      setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function exportCsv() {
    const header = [
      "bookingId",
      "start",
      "end",
      "deviceTimezone",
      "leadEmail",
      "leadPhone",
      "leadCountry",
      "leadTimezone",
      "createdAt",
    ];

    const lines = bookings.map((b) => [
      b.id,
      b.slot.startsAt,
      b.slot.endsAt,
      b.timezone || "",
      b.lead.email,
      b.lead.phone,
      b.lead.country,
      b.lead.timezone,
      b.createdAt,
    ]);

    const csv = [header, ...lines]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll(`"`, `""`)}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Admin</div>
        <h1 className="h1" style={{ fontSize: 44, marginTop: 12 }}>
          Bookings & client contacts
        </h1>
        <p className="p">
          Use this list to message clients on WhatsApp. You can also export CSV.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <button className="btn btnGhost" onClick={() => router.push("/admin/slots")}>
            Slots
          </button>

          <button className="btn btnGhost" onClick={() => router.push("/")}>
            Home
          </button>

          <button className="btn btnGhost" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button className="btn btnGhost" onClick={exportCsv} disabled={bookings.length === 0}>
            Export CSV
          </button>

          <label className="p" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={onlyUpcoming}
              onChange={(e) => setOnlyUpcoming(e.target.checked)}
            />
            Show only upcoming
          </label>
        </div>

        {error && (
          <div className="card" style={{ borderColor: "rgba(255,120,120,0.6)", marginTop: 14 }}>
            <b style={{ color: "#ffd4d4" }}>Fix this</b>
            <div className="p" style={{ marginTop: 6 }}>
              {error}
            </div>
            <div className="p" style={{ marginTop: 8, opacity: 0.9 }}>
              If you see “Unauthorized”, it means your admin email isn’t allowed. Add it to
              ADMIN_EMAILS / ADMIN_EMAIL in your env vars.
            </div>
          </div>
        )}

        <div className="card" style={{ marginTop: 14 }}>
          {loading ? (
            <div className="p">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p">No bookings found.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {bookings.map((b) => (
                <div key={b.id} className="card" style={{ background: "rgba(10,16,32,0.35)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        {fmt(b.slot.startsAt)} → {fmt(b.slot.endsAt)}
                      </div>

                      <div className="p" style={{ marginTop: 6, opacity: 0.9 }}>
                        <b>Email:</b> {b.lead.email}{" "}
                        <button className="btn btnGhost" style={{ padding: "6px 10px", marginLeft: 8 }}
                          onClick={() => copy(b.lead.email)}>
                          Copy
                        </button>
                      </div>

                      <div className="p" style={{ marginTop: 6, opacity: 0.9 }}>
                        <b>WhatsApp:</b> {b.lead.phone}{" "}
                        <button className="btn btnGhost" style={{ padding: "6px 10px", marginLeft: 8 }}
                          onClick={() => copy(b.lead.phone)}>
                          Copy
                        </button>{" "}
                        <a className="btn btnPrimary" style={{ padding: "6px 10px", marginLeft: 8 }}
                          href={waLink(b.lead.phone)} target="_blank" rel="noreferrer">
                          Open chat
                        </a>
                      </div>

                      <div className="p" style={{ marginTop: 8, opacity: 0.8 }}>
                        <b>Device TZ:</b> {b.timezone || "N/A"} • <b>Lead TZ:</b> {b.lead.timezone} •{" "}
                        <b>Country:</b> {b.lead.country}
                      </div>

                      <div className="p" style={{ marginTop: 6, opacity: 0.75 }}>
                        <b>Booking ID:</b> {b.id}{" "}
                        <button className="btn btnGhost" style={{ padding: "6px 10px", marginLeft: 8 }}
                          onClick={() => copy(b.id)}>
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="p" style={{ opacity: 0.7, whiteSpace: "nowrap" }}>
                      Created: {fmt(b.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
