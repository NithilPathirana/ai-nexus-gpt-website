"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TermsStep() {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function next() {
    setError("");
    if (!checked) {
      setError("You must agree to continue.");
      return;
    }
    document.cookie = `nexus_terms=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    router.push("/onboarding/details");
  }

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Step 1 of 3</div>
        <h1 className="h1" style={{ fontSize: 38, marginTop: 12 }}>Agree to our policies</h1>
        <p className="p">
          Before booking your onboarding call, please read and agree to the following:
        </p>

        <div className="card" style={{ background: "rgba(10,16,32,0.65)", marginTop: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="/terms" target="_blank"><b>Terms & Agreements</b></a>
            <a href="/privacy" target="_blank"><b>Privacy Policy</b></a>
            <a href="/usage" target="_blank"><b>Usage Policy</b></a>
            <a href="/refunds" target="_blank"><b>Refund Policy</b></a>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
          <input
            id="agree"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <label htmlFor="agree" className="p" style={{ margin: 0 }}>
            I have read and agree to all policies above.
          </label>
        </div>

        {error && <div style={{ marginTop: 10, color: "#ff8a8a", fontWeight: 700 }}>{error}</div>}

        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btnGhost" href="/">Back</a>
          <button className="btn btnPrimary" onClick={next}>Next</button>
        </div>

        <small style={{ display: "block", marginTop: 12 }}>
          You’ll enter your contact details next, then you’ll pick a call slot.
        </small>
      </div>
    </div>
  );
}
