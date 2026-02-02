export default function PrivacyPage() {
  const BUSINESS_NAME = "AI Nexus GPT";
  const LAST_UPDATED = "2026-01-31";
  const CONTACT_EMAIL = "AI.Nexus.store@gmail.com";
  const CONTACT_PHONE = "0766398548";

  return (
    <div className="section">
      <div className="card">
        <h1 className="h1" style={{ fontSize: 40 }}>Privacy Policy </h1>
        <p className="p">
          <b>{BUSINESS_NAME}</b> — Last updated: <b>{LAST_UPDATED}</b>
          <br />
          Contact: <b>{CONTACT_EMAIL}</b> | <b>{CONTACT_PHONE}</b>
        </p>

        <hr className="hr" />

        <h2 className="h2">1) Who we are</h2>
        <p className="p">
          {BUSINESS_NAME} provides onboarding and access to AI subscription services.
        </p>

        <h2 className="h2">2) What we collect</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li><b>Account info:</b> email (and optional phone)</li>
          <li><b>Booking info:</b> date/time you choose for onboarding</li>
          <li><b>Subscription info:</b> plan status, timestamps, payment references</li>
          <li><b>Policy acceptance logs:</b> acceptance timestamp + IP address</li>
          <li><b>NIC security check:</b> only last 4 digits + verification flag (no full NIC stored)</li>
        </ul>

        <h2 className="h2">3) Why we collect it</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Create and manage your account</li>
          <li>Deliver onboarding and support</li>
          <li>Run trial + paid access flow</li>
          <li>Reduce abuse/fraud (including one-trial-per-NIC-last4 checks)</li>
          <li>Send important service and billing notices</li>
        </ul>

        <h2 className="h2">4) Payments</h2>
        <p className="p">
          Payments are processed by a third-party payment provider (e.g., PayHere).
          We do not store your card number or CVV.
        </p>

        <h2 className="h2">5) Sharing</h2>
        <p className="p">We do not sell personal data. We may share limited data only when needed:</p>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Email delivery (login links + confirmations)</li>
          <li>Payment provider (processing payments)</li>
          <li>Hosting/database provider (running the platform)</li>
        </ul>

        <h2 className="h2">6) Retention</h2>
        <p className="p">
          We keep data only as long as needed for service operation, security, and legitimate business needs.
        </p>

        <h2 className="h2">7) Your choices</h2>
        <p className="p">
          You can request access, correction, or deletion by contacting <b>{CONTACT_EMAIL}</b>.
          Some records may be retained for security/audit.
        </p>

        <h2 className="h2">8) Security</h2>
        <p className="p">
          We use access controls and standard security practices, but no system is perfect.
        </p>

        <h2 className="h2">9) Changes</h2>
        <p className="p" style={{ marginBottom: 0 }}>
          If we update this policy, we will update the “Last updated” date. If changes are important,
          we may require you to re-accept.
        </p>
      </div>
    </div>
  );
}
