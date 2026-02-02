import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";

  // If you forgot to set env vars, block access (safer than accidentally public)
  if (!user || !pass) {
    return new NextResponse(
      "Admin auth is not configured. Set ADMIN_USER and ADMIN_PASS.",
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization") || "";
  const [type, encoded] = auth.split(" ");

  if (type === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const [u, p] = decoded.split(":");

    if (u === user && p === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}
