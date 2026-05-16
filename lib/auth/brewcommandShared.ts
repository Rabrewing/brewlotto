type BrewCommandUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

const DEFAULT_BREWCOMMAND_ADMIN_EMAILS = [
  'command@brewlotto.app',
  'michael.brewington@gmail.com',
  'tlloretta30@gmail.com',
];

const DEFAULT_BREW_QA_TESTER_EMAILS = [
  'michael.brewington@gmail.com',
  'jhardygraham@gmail.com',
  'mariaarellanonc@gmail.com',
  'tlloretta30@gmail.com',
  'audrea1153@aol.com',
  'kappaphi0@gmail.com',
  'dannyenorman@icloud.com',
  'nygyrl85@yahoo.com',
  'rb.brewington@gmail.com',
  'latasharorie@hotmail.com',
];

export function parseBrewCommandAdminEmails() {
  const configuredEmails = (process.env.BREWCOMMAND_ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(
    new Set([
      ...DEFAULT_BREWCOMMAND_ADMIN_EMAILS,
      ...configuredEmails,
    ]),
  );
}

export function parseBrewQATesterEmails() {
  const configuredEmails = (process.env.BREWQA_TESTER_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(
    new Set([
      ...DEFAULT_BREW_QA_TESTER_EMAILS,
      ...configuredEmails,
    ]),
  );
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

export function isBrewQATesterUser(user: BrewCommandUserLike) {
  const email = user.email?.toLowerCase() || '';
  const testerEmails = parseBrewQATesterEmails();

  if (email && testerEmails.includes(email)) {
    return true;
  }

  const metadata = [user.app_metadata || {}, user.user_metadata || {}];
  return metadata.some((entry) =>
    entry.role === 'tester' ||
    entry.role === 'qa' ||
    entry.role === 'quality_assurance' ||
    entry.isTester === true ||
    entry.is_tester === true ||
    entry.isQA === true ||
    entry.is_qa === true ||
    (Array.isArray(entry.roles) && (entry.roles.includes('tester') || entry.roles.includes('qa')))
  );
}

export function isBrewCommandAccessUser(user: BrewCommandUserLike) {
  return isBrewCommandAdminUser(user) || isBrewQATesterUser(user);
}
