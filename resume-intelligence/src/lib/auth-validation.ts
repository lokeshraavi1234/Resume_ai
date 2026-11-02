// ============================================================
// Real Email and Password Validation Rules
// ============================================================

// Block known temporary, disposable, and fake domains
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'mailinator.com',
  'throwawaymail.com',
  'yopmail.com',
  'yopmail.fr',
  'fakemail.net',
  'sharklasers.com',
  'dispostable.com',
  'trashmail.com',
  'getnada.com',
  'mohmal.com',
  'burnermail.io',
  'crazymailing.com',
  'mytemp.email',
  'generator.email',
  'maildrop.cc',
  'inboxkitten.com',
  'fakeinbox.com',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'tinypm.com',
  'test.com',
  'example.com',
  'example.org',
  'example.net',
  'fake.com',
  'sample.com',
  'asdf.com',
  'xyz.com',
  'abc.com',
  'dummy.com',
  'testing.com',
  'invalid.com',
  'domain.com',
]);

// Block dummy or spam prefixes
const FAKE_LOCAL_PATTERNS = [
  /^test$/i,
  /^fake$/i,
  /^dummy$/i,
  /^sample$/i,
  /^asdf/i,
  /^qwerty/i,
  /^1234/i,
  /^1111/i,
  /^aaaa/i,
  /^temp$/i,
  /^nobody$/i,
  /^noone$/i,
  /^admin$/i,
];

// Block common trivial passwords
const FORBIDDEN_PASSWORDS = new Set([
  'password',
  'password123',
  'password1',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  '111111',
  '11111111',
  '123123',
  'qwerty',
  'qwerty123',
  'admin',
  'admin123',
  'pass123',
  'pass1234',
  'welcome',
  'welcome1',
  'abcdef',
  'abcdef1',
  'abcdefgh',
  'resumeai',
  'resume123',
]);

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates whether an email is real and non-disposable
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' };
  }

  const cleaned = email.trim().toLowerCase();

  // Basic RFC format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleaned)) {
    return { isValid: false, error: 'Please provide a valid email format (e.g. name@company.com).' };
  }

  const parts = cleaned.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email structure.' };
  }

  const [localPart, domain] = parts;

  // Local part checks
  if (localPart.length < 2) {
    return { isValid: false, error: 'Email username must be at least 2 characters.' };
  }

  if (FAKE_LOCAL_PATTERNS.some(pat => pat.test(localPart))) {
    return { isValid: false, error: 'Please enter a real personal or work email address.' };
  }

  // Domain checks
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: `The domain "${domain}" is temporary or invalid. Please use a genuine email (e.g. Gmail, Outlook, Yahoo, or your company/university email).`,
    };
  }

  // TLD check (must have at least 2 alpha characters and no consecutive dots)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: 'Email domain has an invalid extension.' };
  }

  return { isValid: true };
}

/**
 * Validates whether a password meets real-world security standards
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.' };
  }

  const lower = password.toLowerCase();
  if (FORBIDDEN_PASSWORDS.has(lower)) {
    return {
      isValid: false,
      error: 'This password is too common and unsafe. Please choose a stronger unique password.',
    };
  }

  // Must contain both letters and numbers
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'Password must include both letters and numbers (e.g. at least 1 digit).',
    };
  }

  return { isValid: true };
}
