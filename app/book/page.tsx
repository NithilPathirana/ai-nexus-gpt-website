export default function BookPage() {
  return (
    <div className="section">
      <div className="card">
      <h1 style={{ marginTop: 0 }}>Book your Zoom call</h1>
      <p>Select a date, then choose an available time. You’ll get the Zoom link by email.</p>

      <form action="/book/choose" method="post" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <label>Date:</label>
        <input name="date" required type="date" />
        <button type="submit">Load times</button>
      </form>

      <small style={{ display: "block", marginTop: 10 }}>
        Trial starts after the call is completed (admin marks it completed).
      </small>
    </div>
    </div>
  );
}
