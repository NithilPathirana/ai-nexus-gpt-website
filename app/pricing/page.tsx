export default function Pricing() {
  return (
    <div className="section">
      <div className="card">
        <h1 className="h1" style={{ fontSize: 40 }}>Pricing</h1>
        <p className="p">
          Simple plans. No surprises. Any plan or price change is only applied after you confirm.
        </p>
      </div>

      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="badge">Monthly</div>
          <h2 className="h2" style={{ marginTop: 10 }}>Rs. 1,199 / month</h2>
          <p className="p">Best for most users.</p>

          <ul style={{ color: "#cfe1ff", lineHeight: 1.7, marginTop: 10 }}>
            <li>Subscription access while active</li>
            <li>Support via email and phone</li>
            <li>Cancel anytime (see terms)</li>
          </ul>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <a className="btn btnPrimary" href="/dashboard">Subscribe</a>
            <a className="btn btnGhost" href="/refunds">Refund policy</a>
          </div>

          <small style={{ display: "block", marginTop: 12 }}>
            PayHere recurring checkout can be connected after business verification.
          </small>
        </div>

        <div className="card">
          <div className="badge">Yearly</div>
          <h2 className="h2" style={{ marginTop: 10 }}>Contact us</h2>
          <p className="p">
            Want a yearly plan? Message us and we’ll set it up.
          </p>

          <ul style={{ color: "#cfe1ff", lineHeight: 1.7, marginTop: 10 }}>
            <li>Everything in monthly</li>
            <li>One payment per year</li>
            <li>Priority support</li>
          </ul>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <a className="btn btnPrimary" href="/contact">Request yearly plan</a>
            <a className="btn btnGhost" href="/terms">Terms</a>
          </div>

          <small style={{ display: "block", marginTop: 12 }}>
            Set a yearly price later and we’ll update this page.
          </small>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2 className="h2">FAQ</h2>
          <p className="p">
            <b>Can you change my price anytime?</b> No. We only apply changes after you approve the new amount and effective date.
          </p>
          <p className="p">
            <b>Do you store card details?</b> No. Payments are handled by the payment provider.
          </p>
          <p className="p">
            <b>Can I cancel?</b> Yes. You can cancel according to the Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
