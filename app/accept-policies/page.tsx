import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AcceptPoliciesPage() {
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
        <h1 className="h1">Accept policies</h1>
        <p className="p">
          Before continuing, you must accept our Terms, Privacy, Usage, and
          Refund policy versions.
        </p>

        <form
          action="/accept-policies/submit"
          method="post"
          style={{ display: "grid", gap: 10 }}
        >
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" required /> I accept the Terms
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" required /> I accept the Privacy policy
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" required /> I accept the Usage policy
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="checkbox" required /> I accept the Refund policy
          </label>

          <button className="btn btnPrimary" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
