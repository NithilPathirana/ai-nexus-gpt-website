import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function KycPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="section">
        <div className="card">
          <h1 className="h1">You need to sign in</h1>
          <p className="p">Please sign in to continue.</p>
          <a className="btn btnPrimary" href="/api/auth/signin">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="card">
        <h1 className="h1">KYC</h1>
        <p className="p">
          This is where we’ll collect KYC details. (Placeholder)
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <button className="btn btnPrimary" type="button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
