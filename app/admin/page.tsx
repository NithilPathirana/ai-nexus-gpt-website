import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);

  return (
    <div className="section">
      <div className="card">
        <div className="badge">Admin</div>
        <h1 className="h1" style={{ fontSize: 40, marginTop: 12 }}>Admin panel</h1>
        <p className="p">Manage slots and view bookings/leads.</p>

        {!session?.user?.email ? (
          <a className="btn btnPrimary" href="/api/auth/signin">Sign in</a>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <a className="btn btnPrimary" href="/admin/slots">Manage slots</a>
            <a className="btn btnGhost" href="/admin/leads">Bookings / Leads</a>
          </div>
        )}
      </div>
    </div>
  );
}
