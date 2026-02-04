export default async function SelectTimePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const sp = await searchParams;
  const date = sp.date || "";

  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(
    `${base}/api/booking/slots?date=${encodeURIComponent(date)}`,
    { cache: "no-store" },
  );
  const data = await res.json();

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Select a time</h1>
      <p>
        <b>Date:</b> {date}
      </p>

      {data.slots.length === 0 ? (
        <p>No slots available for this date.</p>
      ) : (
        <form
          action="/book/confirm"
          method="post"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input type="hidden" name="date" value={date} />
          <label>Time:</label>
          <select name="time" required>
            {data.slots.map((t: string) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit">Book</button>
        </form>
      )}
    </div>
  );
}
