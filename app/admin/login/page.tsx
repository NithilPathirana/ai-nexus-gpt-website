"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onLogin() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed.");

      router.push("/admin/slots");
    } catch (e: any) {
      setErr(e?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="h1" style={{ fontSize: 38 }}>Admin login</h1>
        <p className="p" style={{ marginTop: 8 }}>Enter the admin password to manage slots.</p>

        <div style={{ marginTop: 16 }}>
          <label className="p" style={{ display: "block", marginBottom: 8 }}>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
          />
        </div>

        {err && (
          <div className="card" style={{ borderColor: "rgba(255,120,120,0.6)", marginTop: 14 }}>
            <b style={{ color: "#ffd4d4" }}>Fix this</b>
            <div className="p" style={{ marginTop: 6 }}>{err}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button className="btn btnPrimary" onClick={onLogin} disabled={loading || !password}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <button className="btn btnGhost" onClick={() => router.push("/")}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
