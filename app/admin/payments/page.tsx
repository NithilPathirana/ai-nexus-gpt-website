import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export default async function AdminPayments() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) return <div className="card">Forbidden.</div>;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { subscription: true },
  });

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Payments</h1>
      <p>Paste a PayHere payment link, then send it to the user. This sets status to GRACE (24h).</p>

      <div style={{ display: "grid", gap: 10 }}>
        {users.map((u) => (
          <div className="card" key={u.id} style={{ background: "#0a1020" }}>
            <b>{u.email}</b><br/>
            Status: {u.subscription?.status || "NEW"}<br/>
            Current link: {u.subscription?.payherePaymentLink ? <a href={u.subscription.payherePaymentLink} target="_blank">Open</a> : "—"}

            <form action="/admin/payments/send" method="post" style={{ marginTop: 10, display: "grid", gap: 8 }}>
              <input type="hidden" name="userId" value={u.id} />
              <input name="payherePaymentLink" placeholder="Paste PayHere payment link" style={{ width: "100%" }} />
              <button type="submit">Send payment email + start grace</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
