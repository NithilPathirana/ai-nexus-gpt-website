export default function Contact() {
  return (
    <div className="section">
      <div className="card">
        <h1 className="h1" style={{ fontSize: 40 }}>Contact</h1>
        <p className="p">For billing, subscriptions, and support, contact us using the details below.</p>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Email</b>
            <div style={{ marginTop: 8 }}><a href="mailto:AI.Nexus.store@gmail.com">AI.Nexus.store@gmail.com</a></div>
          </div>

          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Phone</b>
            <div style={{ marginTop: 8 }}>0766398548</div>
          </div>

          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Location</b>
            <div style={{ marginTop: 8 }}>Colombo, Sri Lanka</div>
          </div>

          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b>Hours</b>
            <div style={{ marginTop: 8 }}>Mon–Sat, 9:00 AM – 6:00 PM (Sri Lanka Time)</div>
          </div>
        </div>

        <div className="hr" />
        <h2 className="h2">Plan changes</h2>
        <p className="p" style={{ marginBottom: 0 }}>
          If a plan or price change is proposed, we will ask you to confirm before the new amount is charged.
        </p>
      </div>
    </div>
  );
}
