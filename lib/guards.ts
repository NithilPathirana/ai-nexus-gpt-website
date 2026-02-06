export function isAdmin(email?: string | null) {
  if (!email) return false;

  const admins =
    process.env.ADMIN_EMAIL
      ?.split(",")
      .map(e => e.trim().toLowerCase()) || [];

  return admins.includes(email.toLowerCase());
}
