export default function RefundsPage() {
  // ✅ Constants (edit these whenever you want)
  const BUSINESS_NAME = "AI Nexus GPT";
  const LAST_UPDATED_DATE = "2026-02-01";

  const SUBSCRIPTION_DURATION = "Monthly";
  const ACCESS_RESET_METHOD =
    "security or compliance resets (credentials may be rotated or reassigned)";
  const REFUND_TYPE = "conditional";
  const REFUND_PROCESSING_DAYS = 7;

  return (
    <div className="section">
      <div className="card">
        <h1 className="h1" style={{ fontSize: 40 }}>
          Refund Policy
        </h1>

        <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
          <p className="p" style={{ margin: 0 }}>
            <b>Business Name:</b> {BUSINESS_NAME}
            <br />
            <b>Last Updated:</b> {LAST_UPDATED_DATE}
          </p>
        </div>

        <hr className="hr" />

        <h2 className="h2">Nature of Service</h2>
        <p className="p">
          {BUSINESS_NAME} provides 100% digital, subscription-based services. No
          physical products are sold.
        </p>

        <h2 className="h2">Trial Access & Grace Period</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Users receive a 24-hour trial access and a 24-hour grace period to complete payment.</li>
          <li>Both periods start from the same initial activation time.</li>
          <li>
            If payment is not completed within the grace period, service access is restricted automatically until payment is made.
          </li>
        </ul>

        <h2 className="h2">Subscription Rules</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>
            <b>Subscription duration:</b> {SUBSCRIPTION_DURATION}
          </li>
          <li>Access expires if payment is not renewed.</li>
          <li>
            Login credentials may be changed during <b>{ACCESS_RESET_METHOD}</b>{" "}
            to prevent unauthorized access.
          </li>
        </ul>

        <h2 className="h2">Refund Type</h2>
        <p className="p">
          Refunds are <b>{REFUND_TYPE}</b>.
        </p>

        <h2 className="h2">Refunds MAY be considered if</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Access was not delivered after payment</li>
          <li>Technical failure occurred from our side</li>
          <li>Duplicate payment was made</li>
        </ul>

        <h2 className="h2">Refunds are NOT provided if</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Login credentials were delivered</li>
          <li>Service was used or partially used</li>
          <li>Access was restricted due to non-payment</li>
          <li>Issue was caused by user-side error</li>
        </ul>

        <h2 className="h2">Refund Request Process</h2>
        <p className="p">
          A refund request form must be completed including:
        </p>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Proof of payment</li>
          <li>Bank statement</li>
          <li>External bank account details</li>
          <li>Identity verification if required</li>
        </ul>

        <h2 className="h2">Refund Processing Time</h2>
        <p className="p" style={{ marginBottom: 0 }}>
          <b>{REFUND_PROCESSING_DAYS}</b> business days (bank-dependent).
        </p>
      </div>
    </div>
  );
}
