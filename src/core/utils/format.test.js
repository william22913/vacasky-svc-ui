import { describe, expect, it } from 'vitest';
import { formatCount, formatDate, formatDuration, formatIdr, paragraphsOf } from './format';

describe('format', () => {
  it('formats whole rupiah with the Indonesian grouping', () => {
    expect(formatIdr(4750000)).toBe('Rp 4.750.000');
    expect(formatIdr(0)).toBe('Rp 0');
  });

  it('returns an empty string for non-numeric money', () => {
    expect(formatIdr(undefined)).toBe('');
    expect(formatIdr('4750000')).toBe('');
  });

  it('pluralises durations and counts', () => {
    expect(formatDuration(1)).toBe('1 day');
    expect(formatDuration(3)).toBe('3 days');
    expect(formatCount(1, 'tour')).toBe('1 tour');
    expect(formatCount(14, 'tour')).toBe('14 tours');
  });

  it('formats contract departure dates without shifting the day', () => {
    expect(formatDate('2026-11-20')).toBe('20 November 2026');
    expect(formatDate('2026-12-04')).toBe('4 December 2026');
  });

  it('drops invalid dates instead of rendering them raw', () => {
    expect(formatDate('2026-02-30')).toBe('');
    expect(formatDate('20-11-2026')).toBe('');
    expect(formatDate(null)).toBe('');
  });

  it('splits long text into paragraphs', () => {
    expect(paragraphsOf('One.\n\nTwo.\n \nThree.')).toEqual(['One.', 'Two.', 'Three.']);
  });
});
