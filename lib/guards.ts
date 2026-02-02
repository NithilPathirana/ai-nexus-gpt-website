export function isAdmin(email?: string | null) { return !!email && email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase(); }
