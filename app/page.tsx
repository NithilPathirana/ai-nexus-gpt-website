export default function Home() {
  return (
    <div className="section">
      <div className="grid2">
        <div className="card">
          <div className="badge">AI subscription • Sri Lanka</div>
          <h1 className="h1">AI that feels premium, priced for real life.</h1>
          <p className="p">
            AI Nexus GPT offers AI-powered tools through a simple subscription. Clear pricing, clear policies,
            and plan changes only after you confirm.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            <a className="btn btnPrimary" href="/pricing">See pricing</a>
            <a className="btn btnGhost" href="/contact">Contact support</a>
          </div>

          <div className="hr" />
          <small>Payments can be connected to PayHere recurring after business verification.</small>
        </div>

        <div className="card">
          <div className="badge">Fast • Secure • Subscription</div>
          <h2 className="h2">Your plan</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <b>Monthly</b>
                <b>Rs. 1,199</b>
              </div>
              <small>Cancel anytime · Support</small>
            </div>

            <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
              <b>Price changes need confirmation</b>
              <small style={{ display: "block", marginTop: 6 }}>
                We only apply changes after you approve the new amount and effective date.
              </small>
            </div>

            <a className="btn btnPrimary" href="/onboarding/terms">Get started</a>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="h2">Made for people who move fast</h2>
        <p className="p">Students, creators, and teams who want clean output and simple billing.</p>

        <div className="grid3" style={{ marginTop: 12 }}>
          {["Students", "Creators", "Freelancers", "Founders", "Teams", "Learners"].map((x) => (
            <div key={x} className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
              <b>{x}</b>
              <small style={{ display: "block", marginTop: 6 }}>Fast onboarding. Clear rules. Reliable support.</small>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="h2">What you get</h2>
        <p className="p">Simple features that make the service feel premium, not messy.</p>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Clean access</b>
            <p className="p" style={{ margin: "8px 0 0" }}>
              One subscription, clear renewal, and straightforward support.
            </p>
          </div>
          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Secure billing</b>
            <p className="p" style={{ margin: "8px 0 0" }}>
              Payments processed by a provider. We don’t store full card details.
            </p>
          </div>
          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Consent-based changes</b>
            <p className="p" style={{ margin: "8px 0 0" }}>
              Plan or price changes only after you approve the update.
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2 className="h2">Ready for payment verification</h2>
          <p className="p">
            This site includes pricing, contact info, and legal pages commonly required for verification.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <a className="btn btnPrimary" href="/contact">Start verification</a>
            <a className="btn btnGhost" href="/terms">View terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
