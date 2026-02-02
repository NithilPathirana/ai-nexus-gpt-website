export default function PoolPage({ params }: { params: { poolId: string } }) {
  const poolId = params.poolId;

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Confirm pool selection</h1>
      <p>Pool ID: <b>{poolId}</b></p>

      <form action="/accounts/select" method="post">
        <input type="hidden" name="poolId" value={poolId} />
        <button type="submit">Confirm & continue</button>
      </form>
    </div>
  );
}
