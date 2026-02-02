"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LeadRow = {
  id: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  createdAt: string;
  latestBooking: null | {
    id: string;
    timezone: string | null;
    zoomJoinUrl: string | null;
    startsAt: string | null;
    endsAt: string | null;
  };
};

function fmt(iso: string, tz?: string | null) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz || undefined,
  }).format(d);
}

export default function AdminLeadsPage() {
  const router = useRouter();

  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");

  const brandName = useMemo(() => {
    // client-side env: only NEXT_PUBLIC_* is available, so we just hardcode brand here.
    return "Nexus GPT";
  }, []);

  async function load() {
    setErr("");
    setToast("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
      setRows(Array.isArray(data?.leads) ? data.leads : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load leads.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function buildWhatsappText(r: LeadRow) {
    const b = r.latestBooking;

    // You can change this wording anytime.
    if (!b?.startsAt || !b?.endsAt) {
      return `Hi! This is ${brandName}. We received your details, but your booking time isn't attached yet. Reply here and we’ll confirm a time.`;
    }

    // Use booking timezone if stored, else lead timezone
    const tz = b.timezone || r.timezone || "Asia/Colombo";

    const startText = fmt(b.startsAt, tz);
    const endText = fmt(b.endsAt, tz);

    // IMPORTANT:
    // We can’t read server env (ZOOM_JOIN_URL) directly in a client page.
    // So we keep this message ready to paste, and you can paste the link manually OR
    // we add a small API endpoint later to fetch the zoom link for admin.
    //
    // If you want it fully automatic, tell me and I’ll add /api/admin/config that returns ZOOM_JOIN_URL.
    const zoom = b.zoomJoinUrl || "[PASTE_ZOOM_LINK_HERE]";

    return (
      `Hi! This is ${brandName} ✅\n\n` +
      `Your onboarding call is booked.\n\n` +
      `🕒 Time: ${startText} – ${endText}\n` +
      `🌍 Timezone: ${tz}\n` +
      `🔗 Zoom: ${zoom}\n\n` +
      `Reply “OK” to confirm.`
    );
  }

  async function copyMessage(r: LeadRow) {
    try {
      const text = buildWhatsappText(r);
      await navigator.clipboard.writeText(text);
      setToast("Copied WhatsApp message ✅");
      setTimeout(() => setToast(""), 1400);
    } catch {
      setErr("Could not copy. Your browser blocked clipboard access.");
    }
  }

  async function deleteLead(id: string) {
    setErr("");
    setToast("");
    if (!confirm("Delete this lead? This removes their bookings too.")) return;

    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Delete failed (${res.status})`);
      setToast("Deleted ✅");
      setRows((prev) => prev.filter((x) => x.id !== id));
      setTimeout(() => setToast(""), 1400);
    } catch (e: any) {
      setErr(e?.message || "Delete failed.");
    }
  }

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Admin</div>
        <h1 className="h1" style={{ fontSize: 44, marginTop: 12 }}>
          Leads
        </h1>
        <p className="p">
          View client details + latest booking, copy a WhatsApp message, then delete once contacted.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <button className="btn btnGhost" onClick={() => router.push("/admin/slots")}>
            Slots
          </button>
          <button className="btn btnGhost" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {err && (
          <div className="card" style={{ borderColor: "rgba(255,120,120,0.6)", marginTop: 14 }}>
            <b style={{ color: "#ffd4d4" }}>Fix this</b>
            <div className="p" style={{ marginTop: 6 }}>{err}</div>
          </div>
        )}

        {toast && (
          <div className="card" style={{ borderColor: "rgba(120,255,160,0.35)", marginTop: 14 }}>
            <b style={{ color: "#d6ffe3" }}>Done</b>
            <div className="p" style={{ marginTop: 6 }}>{toast}</div>
          </div>
        )}

        <div className="card" style={{ marginTop: 14, overflowX: "auto" }}>
          {rows.length === 0 && !loading ? (
            <div className="p">No leads yet.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ textAlign: "left", opacity: 0.9 }}>
                  <th style={{ padding: 10 }}>Email</th>
                  <th style={{ padding: 10 }}>WhatsApp</th>
                  <th style={{ padding: 10 }}>Country</th>
                  <th style={{ padding: 10 }}>Lead TZ</th>
                  <th style={{ padding: 10 }}>Latest booking</th>
                  <th style={{ padding: 10 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const b = r.latestBooking;
                  const bookingText =
                    b?.startsAt && b?.endsAt
                      ? `${fmt(b.startsAt, b.timezone || r.timezone)} → ${fmt(b.endsAt, b.timezone || r.timezone)}`
                      : "—";

                  return (
                    <tr key={r.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <td style={{ padding: 10, fontWeight: 650 }}>{r.email}</td>
                      <td style={{ padding: 10 }}>{r.phone}</td>
                      <td style={{ padding: 10 }}>{r.country}</td>
                      <td style={{ padding: 10 }}>{r.timezone}</td>
                      <td style={{ padding: 10 }}>
                        <div style={{ fontWeight: 650 }}>{bookingText}</div>
                        {b?.id ? (
                          <div className="p" style={{ marginTop: 4, opacity: 0.8 }}>
                            Booking ID: {b.id}
                          </div>
                        ) : null}
                      </td>
                      <td style={{ padding: 10 }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <button className="btn btnGhost" onClick={() => copyMessage(r)}>
                            Copy WhatsApp message
                          </button>
                          <button
                            className="btn btnGhost"
                            onClick={() => deleteLead(r.id)}
                            style={{ borderColor: "rgba(255,120,120,0.35)" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
