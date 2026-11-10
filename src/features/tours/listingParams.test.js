import { describe, expect, it } from 'vitest';
import {
  MAX_SEARCH_LENGTH,
  buildListingSearch,
  countActiveFilters,
  parseListingParams,
} from './listingParams';

describe('parseListingParams', () => {
  it('fills safe defaults for an empty query', () => {
    const params = parseListingParams(new URLSearchParams(''));
    expect(params.q).toBe('');
    expect(params.destination).toBeNull();
    expect(params.category).toBeNull();
    expect(params.sort).toBe('recommended');
    expect(params.page).toBe(1);
    expect(params.invalidRange).toBe(false);
  });

  it('ignores invalid sort and page values', () => {
    const params = parseListingParams(new URLSearchParams('sort=cheapest&page=0'));
    expect(params.sort).toBe('recommended');
    expect(params.page).toBe(1);
  });

  it('trims the keyword and caps it at 100 characters', () => {
    const long = 'x'.repeat(MAX_SEARCH_LENGTH + 5);
    const params = parseListingParams(new URLSearchParams({ q: `  ${long}  ` }));
    expect(params.q).toHaveLength(MAX_SEARCH_LENGTH);
    expect(params.searchTooLong).toBe(true);
  });

  it('flags an inverted range without repairing it', () => {
    const params = parseListingParams(new URLSearchParams('priceMin=900&priceMax=100'));
    expect(params.priceError).toBe(true);
    expect(params.invalidRange).toBe(true);
  });

  it('falls back to unfiltered when a value is repeated or malformed', () => {
    expect(
      parseListingParams(new URLSearchParams('destination=bali&destination=lombok')).destination
    ).toBeNull();
    expect(parseListingParams(new URLSearchParams('destination=not a slug')).destination).toBeNull();
    expect(parseListingParams(new URLSearchParams('category=Sailing')).category).toBeNull();
    expect(parseListingParams(new URLSearchParams('category=Beach')).category).toBe('Beach');
  });

  it('keeps a known destination slug', () => {
    expect(parseListingParams(new URLSearchParams('destination=bali')).destination).toBe('bali');
  });
});

describe('buildListingSearch', () => {
  it('omits defaults', () => {
    const search = buildListingSearch({
      q: '',
      destination: null,
      category: null,
      sort: 'recommended',
      page: 1,
    });
    expect(search.toString()).toBe('');
  });

  it('round-trips an active query', () => {
    const search = buildListingSearch({
      q: 'komodo',
      destination: 'komodo',
      category: 'Adventure',
      priceMin: 1000000,
      priceMax: 5000000,
      durationMin: 2,
      durationMax: 5,
      sort: 'price-asc',
      page: 2,
    });
    const params = parseListingParams(search);
    expect(params.q).toBe('komodo');
    expect(params.destination).toBe('komodo');
    expect(params.category).toBe('Adventure');
    expect(params.priceMin).toBe(1000000);
    expect(params.sort).toBe('price-asc');
    expect(params.page).toBe(2);
  });
});

describe('countActiveFilters', () => {
  it('counts filter groups, not individual values', () => {
    const params = parseListingParams(
      new URLSearchParams('destination=bali&priceMin=100&durationMax=4')
    );
    expect(countActiveFilters(params)).toBe(3);
  });
});
