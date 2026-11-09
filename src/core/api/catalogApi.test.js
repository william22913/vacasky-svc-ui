import { describe, expect, it } from 'vitest';
import { serializeTourSearch } from './catalogApi';

describe('serializeTourSearch', () => {
  it('maps the listing keys onto the contract parameters', () => {
    const search = serializeTourSearch({
      q: 'komodo',
      destination: 'bali',
      category: 'Beach',
      priceMin: 1000000,
      priceMax: 5000000,
      durationMin: 2,
      durationMax: 5,
      sort: 'price-asc',
      page: 2,
    });

    expect(search.toString()).toBe(
      'q=komodo&destination=bali&category=Beach&price_min=1000000&price_max=5000000' +
        '&duration_min=2&duration_max=5&sort=price-asc&page=2'
    );
  });

  it('omits absent values and defaults', () => {
    const search = serializeTourSearch({
      q: '  ',
      destination: null,
      category: null,
      priceMin: null,
      sort: 'recommended',
      page: 1,
    });
    expect(search.toString()).toBe('');
  });

  it('trims the keyword before sending it', () => {
    expect(serializeTourSearch({ q: '  bali  ' }).get('q')).toBe('bali');
  });
});
