"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/admin/bookings",
    });

    if (res?.error) setError("Invalid username or password");
  }

  return (
    <div className="section">
      <div className="card" style={{ maxWidth: 420, margin: "auto" }}>
        <h1 className="h1">Admin Login</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btnPrimary">Login</button>
        </form>
      </div>
    </div>
  );
}

