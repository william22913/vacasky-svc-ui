import { describe, expect, it } from 'vitest';
import { badgeLabel, formatCount, formatDuration, formatIdr, paragraphsOf } from './format';

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

  it('maps badges to human labels and ignores unknown ones', () => {
    expect(badgeLabel('best_seller')).toBe('Best seller');
    expect(badgeLabel('other')).toBeNull();
  });

  it('splits long text into paragraphs', () => {
    expect(paragraphsOf('One.\n\nTwo.\n \nThree.')).toEqual(['One.', 'Two.', 'Three.']);
  });
});
