export default function ThankYou() {
  return (
    <div className="section">
      <div className="card">
        <div className="badge">Booked</div>
        <h1 className="h1" style={{ fontSize: 46, marginTop: 12 }}>Thank you</h1>
        <p className="p" style={{ fontSize: 16 }}>
          Our team will get back to you shortly.
        </p>
        <p className="p" style={{ fontSize: 16 }}>
          The link to the onboarding Zoom meeting will be sent to you shortly (with date, time, and passcode).
        </p>

        <div style={{ marginTop: 16 }}>
          <a className="btn btnPrimary" href="/">Back to home</a>
        </div>
      </div>
    </div>
  );
}
