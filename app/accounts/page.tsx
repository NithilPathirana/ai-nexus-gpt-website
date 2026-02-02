import { prisma } from "@/lib/prisma";

export default async function AccountsPage() {
  const pools = await prisma.accountPool.findMany({
    where: { isActive: true },
    include: { slots: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Available account pools</h1>
        <p>Pick a pool. Each pool has 10 slots.</p>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {pools.map((p) => {
          const used = p.slots.length;
          const available = Math.max(0, p.totalSlots - used);
          return (
            <div className="card" key={p.id}>
              <b>{p.name}</b>
              <div style={{ marginTop: 6 }}>Slots available: <b>{available}</b> / {p.totalSlots}</div>
              <div style={{ marginTop: 10 }}>
                <a href={`/accounts/${p.id}`}>Select →</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
