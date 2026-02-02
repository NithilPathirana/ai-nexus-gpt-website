import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function KycPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
    <div className="section">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>NIC security check</h1>
        <p>Please log in first.</p>
        <a href="/api/auth/signin">Log in →</a>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="card">
      <h1 style={{ marginTop: 0 }}>NIC security check</h1>
      <p>
        For security, we store only the <b>last 4 digits</b> of your NIC (Option A), plus a verification flag.
      </p>

      <form action="/kyc/submit" method="post" style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <div>
          <div style={{ marginBottom: 6 }}>Full name</div>
          <input name="fullName" required style={{ width: "100%" }} />
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>NIC number</div>
          <input name="nicNumber" required style={{ width: "100%" }} />
        </div>

        <label>
          <input name="consent" type="checkbox" required /> I consent to this security check as described in the Privacy Policy.
        </label>

        <button type="submit">Save & continue</button>
      </form>
    </div>
    </div>
  );
}
