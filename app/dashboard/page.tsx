import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function fmt(dt?: Date | null) {
  if (!dt) return "—";
  return dt.toISOString().replace("T", " ").slice(0, 16);
}

function StepCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
      <b style={{ fontSize: 16 }}>{title}</b>
      <div className="p" style={{ marginTop: 6, fontSize: 14 }}>
        {desc}
      </div>
      <div style={{ marginTop: 12 }}>
        <a className="btn btnPrimary" href={href}>
          Continue
        </a>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="section">
        <div className="card">
          <div className="badge">Get started</div>
          <h1 className="h1" style={{ fontSize: 40 }}>
            Sign in to continue
          </h1>
          <p className="p">
            You’ll receive a secure login link by email. After login, you’ll
            accept policies, do a quick NIC security check, choose an available
            pool slot, and book a Zoom onboarding call.
          </p>
          <div style={{ marginTop: 14 }}>
            <a className="btn btnPrimary" href="/api/auth/signin">
              Send me a login link
            </a>
          </div>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return <div className="card">User not found</div>;

  const sub = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });
  const pol = await prisma.policyAcceptance.findUnique({
    where: { userId: user.id },
  });
  const kyc = await prisma.kycRecord.findUnique({ where: { userId: user.id } });
  const slot = await prisma.poolSlot.findUnique({
    where: { userId: user.id },
    include: { pool: true },
  });
  const booking = await prisma.booking.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const settings = await prisma.adminSetting.findFirst();

  const status = sub?.status || "NEW";
  const graceAccessAllowed = settings?.graceAccessAllowed ?? true;

  const accessAllowed =
    status === "ACTIVE" ||
    status === "TRIAL_ACTIVE" ||
    (status === "GRACE" && graceAccessAllowed);

  const paymentLink = sub?.payherePaymentLink || "";

  const nextStep = !pol
    ? {
        t: "Step 1: Agree to policies",
        d: "You must agree to Terms, Privacy, Usage, and Refund policies to continue.",
        h: "/accept-policies",
      }
    : !kyc
      ? {
          t: "Step 2: NIC security check",
          d: "For security (Option A), we store only the last 4 digits of your NIC.",
          h: "/kyc",
        }
      : !slot
        ? {
            t: "Step 3: Choose a pool slot",
            d: "Select an available pool. Each pool has 10 slots.",
            h: "/accounts",
          }
        : !booking
          ? {
              t: "Step 4: Book Zoom onboarding",
              d: "Pick a time. We email you the Zoom link automatically.",
              h: "/book",
            }
          : null;

  return (
    <div className="section">
      <div className="grid2">
        <div className="card">
          <div className="badge">Dashboard</div>
          <h1 className="h1" style={{ fontSize: 40, marginTop: 12 }}>
            Welcome
          </h1>
          <p className="p" style={{ marginBottom: 10 }}>
            <b>Logged in:</b> {user.email}
          </p>

          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <div style={{ display: "grid", gap: 6 }}>
              <div>
                <b>Status:</b> {status}
              </div>
              <div>
                <b>Access:</b> {accessAllowed ? "Allowed" : "Paused"}
              </div>
              <div>
                <b>Trial ends:</b> {fmt(sub?.trialEndsAt)}
              </div>
              <div>
                <b>Grace ends:</b> {fmt(sub?.graceEndsAt)}
              </div>

              {status === "GRACE" && (
                <div>
                  <b>Payment link:</b>{" "}
                  {paymentLink ? (
                    <a href={paymentLink} target="_blank">
                      Open PayHere link
                    </a>
                  ) : (
                    "Not set yet (admin will send)"
                  )}
                </div>
              )}
            </div>
          </div>

          {slot && (
            <div style={{ marginTop: 12 }}>
              <div className="badge">Your pool: {slot.pool.name}</div>
            </div>
          )}

          {booking && (
            <div style={{ marginTop: 12 }} className="card">
              <b>Latest booking</b>
              <div className="p" style={{ marginTop: 6, fontSize: 14 }}>
                {booking.date.toISOString().replace("T", " ").slice(0, 16)}{" "}
                (status: {booking.status})
              </div>
              <small style={{ display: "block", marginTop: 10 }}>
                Trial starts after admin marks the call completed.
              </small>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {nextStep ? (
            <StepCard title={nextStep.t} desc={nextStep.d} href={nextStep.h} />
          ) : (
            <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
              <b style={{ fontSize: 16 }}>You’re all set</b>
              <div className="p" style={{ marginTop: 6, fontSize: 14 }}>
                If you need support, use the Contact page. If payment is due,
                check your email for the PayHere link.
              </div>
              <div style={{ marginTop: 12 }}>
                <a className="btn btnGhost" href="/contact">
                  Contact support
                </a>
              </div>
            </div>
          )}

          <div className="card" style={{ background: "rgba(10,16,32,0.65)" }}>
            <b style={{ fontSize: 16 }}>Need to see pricing first?</b>
            <div className="p" style={{ marginTop: 6, fontSize: 14 }}>
              You can always review pricing and policies before continuing.
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <a className="btn btnGhost" href="/pricing">
                Pricing
              </a>
              <a className="btn btnGhost" href="/terms">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
