export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 80 && SLUG_PATTERN.test(slug);
}
