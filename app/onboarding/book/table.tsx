"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";

type Slot = { id: string; startsAt: string; capacity: number; booked: number };

export default function BookTable({ leadId, timezone, slots }: { leadId: string; timezone: string; slots: Slot[] }) {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rows = useMemo(() => {
    return slots.map((s) => {
      const dt = DateTime.fromISO(s.startsAt, { zone: "utc" }).setZone(timezone);
      const date = dt.toFormat("yyyy-LL-dd");
      const time = dt.toFormat("hh:mm a");
      const available = Math.max(0, s.capacity - s.booked);
      return { ...s, date, time, available };
    });
  }, [slots, timezone]);

  async function book() {
    setError("");
    if (!selected) {
      setError("Select a slot first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, slotId: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to book");
      window.location.href = "/onboarding/thank-you";
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Date</th>
              <th style={{ padding: "10px 8px" }}>Time</th>
              <th style={{ padding: "10px 8px" }}>Available</th>
              <th style={{ padding: "10px 8px" }}>Select</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 12 }}><small>No slots available right now. Please check later.</small></td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid rgba(20,29,52,1)" }}>
                <td style={{ padding: "10px 8px" }}>{r.date}</td>
                <td style={{ padding: "10px 8px" }}>{r.time}</td>
                <td style={{ padding: "10px 8px" }}>{r.available}</td>
                <td style={{ padding: "10px 8px" }}>
                  <input
                    type="radio"
                    name="slot"
                    value={r.id}
                    disabled={r.available <= 0}
                    checked={selected === r.id}
                    onChange={() => setSelected(r.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div style={{ marginTop: 10, color: "#ff8a8a", fontWeight: 700 }}>{error}</div>}

      <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a className="btn btnGhost" href="/onboarding/details">Back</a>
        <button className="btn btnPrimary" onClick={book} disabled={loading}>
          {loading ? "Booking..." : "Book"}
        </button>
      </div>
    </div>
  );
}
