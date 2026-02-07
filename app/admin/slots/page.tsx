"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SlotRow = {
  id: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
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

export default function AdminSlotsPage() {
  const router = useRouter();

  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Create default values for “Add slot”
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const nowLocal = useMemo(() => new Date(), []);

  useEffect(() => {
    // default add times: next hour → +30 minutes
    const d = new Date(nowLocal);
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    const d2 = new Date(d.getTime() + 30 * 60 * 1000);

    // datetime-local needs "YYYY-MM-DDTHH:mm"
    const toLocalInput = (x: Date) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(
        x.getHours()
      )}:${pad(x.getMinutes())}`;
    };

    setStartsAt(toLocalInput(d));
    setEndsAt(toLocalInput(d2));

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setErr("");
    setOk("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/slots", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) router.push("/admin/login");
        throw new Error(data?.error || "Failed to load slots.");
      }
      setSlots(Array.isArray(data?.slots) ? data.slots : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load slots.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function addSlot() {
    setErr("");
    setOk("");
    setSaving(true);
    try {
      // Convert local input → ISO (UTC)
      const start = new Date(startsAt);
      const end = new Date(endsAt);

      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to create slot.");

      setOk("Slot added.");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to create slot.");
    } finally {
      setSaving(false);
    }
  }

  async function disableSlot(id: string) {
    setErr("");
    setOk("");
    try {
      const res = await fetch(`/api/admin/slots/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to disable slot.");
      setOk("Slot disabled.");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to disable slot.");
    }
  }

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Admin</div>
        <h1 className="h1" style={{ fontSize: 40, marginTop: 12 }}>
          Manage onboarding slots
        </h1>
        <p className="p">Add new call slots and disable existing ones.</p>

        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Add a slot</h2>

          <div style={{ display: "grid", gap: 12, marginTop: 12, maxWidth: 520 }}>
            <div>
              <div className="p" style={{ marginBottom: 6 }}>Start (your local time)</div>
              <input
                type="datetime-local"
                className="input"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>

            <div>
              <div className="p" style={{ marginBottom: 6 }}>End (your local time)</div>
              <input
                type="datetime-local"
                className="input"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btnGhost" onClick={() => router.push("/admin/leads")}>
                  Leads
                </button>
                <button className="btn btnGhost" onClick={() => router.push("/admin/bookings")}>
                  Bookings
                </button>
                <button className="btn btnGhost" onClick={() => router.push("/")}>
                  Home
                </button>
                <button className="btn btnGhost" onClick={() => router.push("/onboarding/terms")}>
                  Onboarding
                </button>
            </div>
          </div>
        </div>

        {err && (
          <div className="card" style={{ borderColor: "rgba(255,120,120,0.6)", marginTop: 14 }}>
            <b style={{ color: "#ffd4d4" }}>Fix this</b>
            <div className="p" style={{ marginTop: 6 }}>{err}</div>
          </div>
        )}

        {ok && (
          <div className="card" style={{ borderColor: "rgba(120,255,160,0.35)", marginTop: 14 }}>
            <b style={{ color: "#d6ffe3" }}>Done</b>
            <div className="p" style={{ marginTop: 6 }}>{ok}</div>
          </div>
        )}

        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Slots</h2>

          {loading ? (
            <div className="p" style={{ marginTop: 10 }}>Loading...</div>
          ) : slots.length === 0 ? (
            <div className="p" style={{ marginTop: 10 }}>No slots found.</div>
          ) : (
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {slots.map((s) => (
                <div
                  key={s.id}
                  className="card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                    opacity: s.isActive ? 1 : 0.55,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>
                      {fmt(s.startsAt)} → {fmt(s.endsAt)}
                    </div>
                    <div className="p" style={{ marginTop: 4 }}>
                      Status: {s.isActive ? "Active" : "Disabled"} • ID: {s.id}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    {s.isActive ? (
                      <button className="btn btnGhost" onClick={() => disableSlot(s.id)}>
                        Disable
                      </button>
                    ) : (
                      <button className="btn btnGhost" disabled>
                        Disabled
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn btnGhost" onClick={() => router.push("/")}>Home</button>
          <button className="btn btnGhost" onClick={() => router.push("/onboarding/terms")}>
            Onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
