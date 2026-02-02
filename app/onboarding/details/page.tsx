"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type CountryOption = {
  code: string;     // ISO2
  name: string;
  dialCode: string; // like "94"
};

const COUNTRIES: CountryOption[] = [
  { code: "AE", name: "United Arab Emirates", dialCode: "971" },
  { code: "AU", name: "Australia", dialCode: "61" },
  { code: "CA", name: "Canada", dialCode: "1" },
  { code: "DE", name: "Germany", dialCode: "49" },
  { code: "FR", name: "France", dialCode: "33" },
  { code: "GB", name: "United Kingdom", dialCode: "44" },
  { code: "IN", name: "India", dialCode: "91" },
  { code: "LK", name: "Sri Lanka", dialCode: "94" },
  { code: "MY", name: "Malaysia", dialCode: "60" },
  { code: "SG", name: "Singapore", dialCode: "65" },
  { code: "US", name: "United States", dialCode: "1" },
];

const TIMEZONES = [
  "Asia/Colombo",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Kuala_Lumpur",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
];

export default function DetailsStep() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("LK");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Colombo"
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sortedCountries = useMemo(() => {
    return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  async function onNext() {
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanEmail) return setError("Please enter your email.");
    if (!cleanPhone) return setError("Please enter your WhatsApp number.");
    if (!country) return setError("Please select your country/region.");
    if (!timezone) return setError("Please select your timezone.");

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          phone: cleanPhone,
          country,
          timezone,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Save failed (${res.status})`);
      }

      // Extra safety: ensure cookie exists even if browser blocks Set-Cookie for any reason
      if (data?.leadId) {
        document.cookie = `nexus_lead=${data.leadId}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; samesite=lax`;
      }

      router.push("/onboarding/book");
    } catch (e: any) {
      setError(e?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Step 2 of 3</div>

        <h1 className="h1" style={{ fontSize: 40, marginTop: 12 }}>
          Enter your details
        </h1>

        <p className="p">
          We’ll use this to contact you on WhatsApp and send your Zoom onboarding link.
        </p>

        <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
          <div>
            <b>Email</b>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              style={{ width: "100%", marginTop: 8 }}
            />
            <small>Use an email you can access right now.</small>
          </div>

          <div>
            <b>WhatsApp number</b>
            <div style={{ marginTop: 8 }}>
              <PhoneInput
                defaultCountry={country.toLowerCase() as any}
                value={phone}
                onChange={setPhone}
                forceDialCode
              />
            </div>
            <small>Make sure this number has WhatsApp access.</small>
          </div>

          <div className="grid2">
            <div>
              <b>Country / Region</b>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: "100%", marginTop: 8 }}
              >
                {sortedCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} (+{c.dialCode})
                  </option>
                ))}
              </select>
              <small>Sorted alphabetically.</small>
            </div>

            <div>
              <b>Timezone</b>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={{ width: "100%", marginTop: 8 }}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              <small>Times will be shown in your timezone.</small>
            </div>
          </div>

          {error && (
            <div className="card" style={{ borderColor: "rgba(255,120,120,0.6)" }}>
              <b style={{ color: "#ffd4d4" }}>Fix this</b>
              <div className="p" style={{ marginTop: 6 }}>
                {error}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <a className="btn btnGhost" href="/onboarding/terms">
              Back
            </a>
            <button className="btn btnPrimary" onClick={onNext} disabled={loading}>
              {loading ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
