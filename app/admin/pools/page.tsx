import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export default async function AdminPools() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) return <div className="card">Forbidden.</div>;

  const pools = await prisma.accountPool.findMany({ orderBy: { createdAt: "asc" }, include: { slots: true } });

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Pools</h1>
      <p>Create pools, set slot limits, and enable/disable pools.</p>

      <form action="/admin/pools/create" method="post" style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input name="name" placeholder="Pool name (e.g., Pool D)" required />
        <input name="totalSlots" type="number" min="1" max="50" defaultValue="10" />
        <button type="submit">Create pool</button>
      </form>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {pools.map((p) => {
          const used = p.slots.length;
          const available = Math.max(0, p.totalSlots - used);
          return (
            <div className="card" key={p.id} style={{ background: "#0a1020" }}>
              <b>{p.name}</b> {p.isActive ? "(Active)" : "(Disabled)"}<br/>
              Slots: {available} available / {p.totalSlots} total / {used} used
              <form action="/admin/pools/toggle" method="post" style={{ marginTop: 10 }}>
                <input type="hidden" name="poolId" value={p.id} />
                <button type="submit">{p.isActive ? "Disable" : "Enable"}</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
