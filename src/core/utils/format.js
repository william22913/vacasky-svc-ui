const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatIdr(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '';
  return idrFormatter.format(amount).replace(/\u00a0/g, ' ');
}

export function formatDuration(days) {
  if (!Number.isFinite(days) || days < 1) return '';
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function formatCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function paragraphsOf(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const BADGE_LABELS = {
  best_seller: 'Best seller',
};

export function badgeLabel(badge) {
  return BADGE_LABELS[badge] || null;
}
