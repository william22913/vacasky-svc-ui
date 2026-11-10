const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatIdr(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '';
  // Indonesian currency formatting separates "Rp" with a non-breaking space;
  // the design uses a normal space.
  return idrFormatter.format(amount).replace(/\s+/g, ' ');
}

export function formatDuration(days) {
  if (!Number.isFinite(days) || days < 1) return '';
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function formatCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// The contract sends YYYY-MM-DD. Invalid values are dropped, never shown raw.
export function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return '';
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return '';
  }
  return dateFormatter.format(date);
}

export function paragraphsOf(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
