import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "AI Nexus GPT",
  description: "AI subscription • Sri Lanka",
  icons: {
    icon: "/icon.png", 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="nav">
          <div className="container">
            <div className="navInner">
              <a className="brand" href="/">
                <img src="/logo.png" width={34} height={34} alt="AI Nexus GPT logo" />
                <span>AI Nexus GPT</span>
              </a>

              <div className="navLinks">
                <a href="/">Product</a>
                <a href="/pricing">Pricing</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a className="btn btnPrimary" href="/onboarding/terms">Get started</a>
              </div>
            </div>
          </div>
        </div>

        <main className="container">
          {children}
        </main>

        <footer>
          <div className="container">
            <div className="footerLinks">
              <a href="/terms">Terms</a>
              <span>·</span>
              <a href="/privacy">Privacy</a>
              <span>·</span>
              <a href="/usage">Usage</a>
              <span>·</span>
              <a href="/refunds">Refunds</a>
            </div>
            <div style={{ marginTop: 10 }}>
              <small>© 2026 AI Nexus GPT. ai-nexus-gpt.com</small>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
