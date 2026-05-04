type BrewCommandUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

export function parseBrewCommandAdminEmails() {
  return (process.env.BREWCOMMAND_ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isBrewCommandAdminUser(user: BrewCommandUserLike) {
  const email = user.email?.toLowerCase() || '';
  const adminEmails = parseBrewCommandAdminEmails();

  if (email && adminEmails.includes(email)) {
    return true;
  }

  const metadata = [user.app_metadata || {}, user.user_metadata || {}];
  return metadata.some((entry) =>
    entry.role === 'admin' ||
    entry.role === 'superadmin' ||
    entry.isAdmin === true ||
    entry.is_admin === true ||
    entry.isSuperAdmin === true ||
    entry.is_superadmin === true ||
    (Array.isArray(entry.roles) && (entry.roles.includes('admin') || entry.roles.includes('superadmin')))
  );
}
