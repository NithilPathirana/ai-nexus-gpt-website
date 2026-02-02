export default function UsagePolicyPage() {
  // ✅ Constants (edit these whenever you want)
  const MINIMUM_AGE = 13;
  const PARENTAL_AGE_LIMIT = 18;
  const PAYMENT_HANDLER = "a parent/guardian (PayHere checkout handled by them)";
  const ACCESS_RESET_METHOD =
    "security resets (credentials may be rotated/reassigned to prevent misuse)";

  return (
    <div className="section">
      <div className="card">
        <h1 className="h1" style={{ fontSize: 40 }}>
          Usage Policy
        </h1>

        <hr className="hr" />

        <h2 className="h2">Eligibility</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>
            Minimum user age: <b>{MINIMUM_AGE}</b>
          </li>
          <li>
            Users under <b>{PARENTAL_AGE_LIMIT}</b> require parental consent.
          </li>
          <li>
            Payments and portal access must be handled by <b>{PAYMENT_HANDLER}</b>.
          </li>
        </ul>

        <h2 className="h2">Trial & Access Rules</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>24-hour trial access is provided</li>
          <li>24-hour grace period to complete payment</li>
          <li>Both start from the same activation time</li>
          <li>Access is restricted automatically if payment is not completed</li>
        </ul>

        <h2 className="h2">Subscription Usage</h2>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Monthly subscription-based access</li>
          <li>Non-paying users lose access after grace period</li>
          <li>
            Login credentials may be rotated during <b>{ACCESS_RESET_METHOD}</b>
          </li>
        </ul>

        <h2 className="h2">User Responsibilities</h2>
        <p className="p">Users must NOT:</p>
        <ul style={{ color: "#cfe1ff", lineHeight: 1.8 }}>
          <li>Share login credentials</li>
          <li>Resell or transfer access</li>
          <li>Attempt to bypass system restrictions</li>
          <li>Abuse trial or grace period</li>
        </ul>

        <h2 className="h2">Violation Consequences</h2>
        <p className="p">
          Violation may result in immediate access termination without refund.
        </p>

        <h2 className="h2">Data & Privacy</h2>
        <p className="p" style={{ marginBottom: 0 }}>
          User data is handled according to the Privacy Policy. Minimal
          verification data may be stored for compliance and security.
        </p>
      </div>
    </div>
  );
}
