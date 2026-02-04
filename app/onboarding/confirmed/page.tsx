"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type BookingData = {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string | null;
  lead: { email: string; phone: string; country: string; timezone: string };
};

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

function ConfirmedInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const bookingId = sp.get("b") || "";

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState("");

  const deviceTz = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Colombo";
  }, []);

  useEffect(() => {
    async function load() {
      setError("");
      setLoading(true);
      try {
        if (!bookingId) {
          setError("Missing booking id.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/onboarding/booking?id=${encodeURIComponent(bookingId)}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Could not load booking.");

        setBooking(data.booking);
      } catch (e: any) {
        setError(e?.message || "Could not load booking.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId]);

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Booked</div>

        <h1 className="h1" style={{ fontSize: 44, marginTop: 12 }}>
          You’re booked ✅
        </h1>

        <p className="p">
          We sent a confirmation email. We’ll also message you on WhatsApp with
          the Zoom link.
        </p>

        {loading ? (
          <div className="card" style={{ marginTop: 14 }}>
            <div className="p">Loading your booking...</div>
          </div>
        ) : error ? (
          <div
            className="card"
            style={{ borderColor: "rgba(255,120,120,0.6)", marginTop: 14 }}
          >
            <b style={{ color: "#ffd4d4" }}>Fix this</b>
            <div className="p" style={{ marginTop: 6 }}>
              {error}
            </div>
          </div>
        ) : booking ? (
          <div className="card" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>
              {formatSlot(booking.startsAt)}
            </div>
            <div className="p" style={{ marginTop: 6, opacity: 0.9 }}>
              Ends: {formatSlot(booking.endsAt)}
            </div>
            <div className="p" style={{ marginTop: 6, opacity: 0.9 }}>
              Device timezone: {deviceTz}
            </div>
            <div className="p" style={{ marginTop: 6, opacity: 0.9 }}>
              Booking ID: {booking.id}
            </div>
          </div>
        ) : null}

        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}
        >
          <button className="btn btnGhost" onClick={() => router.push("/")}>
            Home
          </button>
          <button
            className="btn btnPrimary"
            onClick={() => router.push("/contact")}
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <div className="card">
            <div className="badge">Booked</div>
            <h1 className="h1" style={{ fontSize: 44, marginTop: 12 }}>
              Loading…
            </h1>
            <p className="p">Preparing your confirmation page.</p>
          </div>
        </div>
      }
    >
      <ConfirmedInner />
    </Suspense>
  );
}
