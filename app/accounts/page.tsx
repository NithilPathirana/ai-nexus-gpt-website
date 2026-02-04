export default function AccountsPage() {
  return (
    <div className="section">
      <div className="grid2">
        <div className="card">
          <div className="badge">Accounts</div>
          <h1 className="h1">Choose an account pool</h1>
          <p className="p">Select which pool you want to use.</p>
        </div>

        <div className="card">
          <h2 className="h2">Available pools</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <a className="btn btnPrimary" href="/accounts/demo-pool">
              Continue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
