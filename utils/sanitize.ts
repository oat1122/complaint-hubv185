import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  const cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  return DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '')
    .substring(0, 255);
}
