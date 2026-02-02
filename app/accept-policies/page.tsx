import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AcceptPoliciesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
    <div className="section">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Agree to policies</h1>
        <p>You need to log in first.</p>
        <a href="/api/auth/signin">Log in →</a>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="card">
      <h1 style={{ marginTop: 0 }}>Agree to policies</h1>
      <p>You must agree to all policies before continuing.</p>

      <form action="/accept-policies/submit" method="post" style={{ display: "grid", gap: 10 }}>
        <label><input name="terms" type="checkbox" required /> I agree to the <a href="/terms" target="_blank">Terms</a></label>
        <label><input name="privacy" type="checkbox" required /> I agree to the <a href="/privacy" target="_blank">Privacy Policy</a></label>
        <label><input name="usage" type="checkbox" required /> I agree to the <a href="/usage" target="_blank">Usage Policy</a></label>
        <label><input name="refunds" type="checkbox" required /> I agree to the <a href="/refunds" target="_blank">Refund Policy</a></label>
        <button type="submit">Agree & continue</button>
      </form>

      <small style={{ display: "block", marginTop: 10 }}>
        If these policies change in the future, you may be asked to accept again.
      </small>
    </div>
    </div>
  );
}
