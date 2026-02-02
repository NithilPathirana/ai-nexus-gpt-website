"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SlotRow = {
  id: string;
  startsAt: string; // ISO
  endsAt: string;   // ISO
};

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((p) => p.trim());
  const hit = parts.find((p) => p.startsWith(name + "="));
  if (!hit) return null;
  return decodeURIComponent(hit.split("=").slice(1).join("="));
}

function formatSlot(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookStep() {
  const router = useRouter();

  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const deviceTz = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Colombo";
  }, []);

  async function loadSlots() {
    setError("");
    setLoadingSlots(true);

    try {
      const res = await fetch("/api/onboarding/slots", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Failed to load slots (${res.status})`);

      const list = Array.isArray(data?.slots) ? data.slots : [];
      setSlots(list);

      // keep selection if still exists; otherwise select first
      if (list.length > 0) {
        const stillThere = list.some((s: SlotRow) => s.id === selectedId);
        if (!selectedId || !stillThere) setSelectedId(list[0].id);
      } else {
        setSelectedId("");
      }
    } catch (e: any) {
      setError(e?.message || "Could not load slots.");
      setSlots([]);
      setSelectedId("");
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    const terms = getCookie("nexus_terms");
    if (!terms) {
      router.push("/onboarding/terms");
      return;
    }

    const leadId = getCookie("nexus_lead");
    if (!leadId) {
      router.push("/onboarding/details");
      return;
    }

    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onBook() {
    setError("");
    setOkMsg("");

    const leadId = getCookie("nexus_lead");
    if (!leadId) {
      setError("Missing lead id. Go back to Step 2 and click Next again.");
      return;
    }
    if (!selectedId) {
      setError("Please select a slot.");
      return;
    }

    setBooking(true);
    try {
      const res = await fetch("/api/onboarding/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedId,
          timezone: deviceTz,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Booking failed (${res.status})`);

      const bookingId = data?.bookingId || data?.booking?.id;
      setOkMsg("Booked! Redirecting...");

      // refresh slots so it disappears immediately
      await loadSlots();

      // go to thank-you screen
      if (bookingId) {
        router.push(`/onboarding/confirmed?b=${encodeURIComponent(bookingId)}`);
      } else {
        // fallback if something weird happens
        router.push(`/onboarding/confirmed`);
      }
    } catch (e: any) {
      setError(e?.message || "Booking failed.");
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Step 3 of 3</div>
        <h1 className="h1" style={{ fontSize: 44, marginTop: 12 }}>
          Book your onboarding call
        </h1>
        <p className="p">Select a slot below. Times are shown in your device time.</p>

        <div className="card" style={{ marginTop: 14 }}>
          {loadingSlots ? (
            <div className="p">Loading slots...</div>
          ) : slots.length === 0 ? (
            <div className="p">No slots available right now. Please check back later.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {slots.map((s) => {
                const active = selectedId === s.id;
                return (
                  <label
                    key={s.id}
                    className="card"
                    style={{
                      cursor: "pointer",
                      borderColor: active ? "rgba(120,200,255,0.8)" : "rgba(255,255,255,0.12)",
                      background: active ? "rgba(10,16,32,0.65)" : "rgba(10,16,32,0.35)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <input
                        type="radio"
                        name="slot"
                        checked={active}
                        onChange={() => setSelectedId(s.id)}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 20 }}>
                          {formatSlot(s.startsAt)}
                        </div>
                        <div className="p" style={{ marginTop: 4, opacity: 0.85 }}>
                          Ends: {formatSlot(s.endsAt)}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="card" style={{ borderColor: "rgba(255,120,120,0.6)", marginTop: 14 }}>
            <b style={{ color: "#ffd4d4" }}>Fix this</b>
            <div className="p" style={{ marginTop: 6 }}>
              {error}
            </div>
          </div>
        )}

        {okMsg && (
          <div className="card" style={{ borderColor: "rgba(120,255,160,0.35)", marginTop: 14 }}>
            <b style={{ color: "#d6ffe3" }}>Done</b>
            <div className="p" style={{ marginTop: 6 }}>
              {okMsg}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <button className="btn btnGhost" onClick={() => router.push("/onboarding/details")}>
            Back
          </button>
          <button className="btn btnPrimary" onClick={onBook} disabled={booking || slots.length === 0}>
            {booking ? "Booking..." : "Book"}
          </button>
          <button className="btn btnGhost" onClick={loadSlots} disabled={loadingSlots}>
            Refresh slots
          </button>
        </div>
      </div>
    </div>
  );
}

