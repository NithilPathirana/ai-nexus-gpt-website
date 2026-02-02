export default function TermsPage() {
  const BUSINESS_NAME = "AI Nexus GPT";

  return (
    <div className="section">
      <div className="card">
        <h1 className="h1" style={{ fontSize: 40 }}>
          Terms & Agreements
        </h1>
        <p className="p">
          These Terms apply to your use of <b>{BUSINESS_NAME}</b>.
        </p>

        <hr className="hr" />

        <h2 className="h2">Acceptance of Terms</h2>
        <p className="p">
          By accessing or using {BUSINESS_NAME}, you agree to these Terms and
          Agreements.
        </p>

        <h2 className="h2">Service Description</h2>
        <p className="p">
          {BUSINESS_NAME} provides digital AI access, subscription services, and
          optional one-time sessions.
        </p>

        <h2 className="h2">Payments</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Prices are shown before checkout.</li>
          <li>Payments are processed via third-party gateways.</li>
          <li>No sensitive payment data is stored.</li>
        </ul>

        <h2 className="h2">Intellectual Property</h2>
        <p className="p">
          All content, branding, and systems belong to {BUSINESS_NAME}.
          Unauthorized copying or redistribution is prohibited.
        </p>

        <h2 className="h2">Limitation of Liability</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Service downtime</li>
          <li>User misuse</li>
          <li>Third-party platform failures</li>
        </ul>

        <h2 className="h2">Access Control</h2>
        <p className="p">
          Access may be restricted or credentials changed for non-payment, policy
          violations, or security reasons.
        </p>

        <h2 className="h2">Modifications</h2>
        <p className="p" style={{ marginBottom: 0 }}>
          These terms may be updated at any time. Continued use implies
          acceptance of updated terms.
        </p>
      </div>
    </div>
  );
}
