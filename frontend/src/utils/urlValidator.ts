/**
 * Registration Link Validation & Secure Navigation Utility
 * (Adheres to Sections 2, 3, 4, 8, 20 of requirements)
 */

export type UrlValidationStatus = 'valid' | 'invalid' | 'missing';

const FAKE_HOSTNAMES = [
  'example.com',
  'www.example.com',
  'hackathon.com',
  'www.hackathon.com',
  'test.com',
  'demo.com'
];

export function validateRegistrationUrl(url?: string | null): UrlValidationStatus {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return 'missing';
  }

  const trimmed = url.trim();

  // 1. Must begin with https://
  if (!trimmed.startsWith('https://')) {
    return 'invalid';
  }

  try {
    const parsed = new URL(trimmed);

    // 2. Must not point to TechPulse itself
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.includes('techpulse')) {
      return 'invalid';
    }

    // 3. Must not be an obviously fake / placeholder domain
    if (FAKE_HOSTNAMES.includes(parsed.hostname.toLowerCase())) {
      return 'invalid';
    }

    return 'valid';
  } catch {
    return 'invalid';
  }
}

export function openExternalUrl(url: string): boolean {
  const status = validateRegistrationUrl(url);
  if (status !== 'valid') {
    return false;
  }

  // Securely opens external verified URL in a new tab without navigating TechPulse away
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
