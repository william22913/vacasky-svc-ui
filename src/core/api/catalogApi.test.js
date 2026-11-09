import { describe, expect, it } from 'vitest';
import { serializeTourSearch } from './catalogApi';

describe('serializeTourSearch', () => {
  it('repeats destination and category values', () => {
    const search = serializeTourSearch({ destination: ['bali', 'labuan-bajo'], category: ['nature'] });
    expect(search.getAll('destination')).toEqual(['bali', 'labuan-bajo']);
    expect(search.getAll('category')).toEqual(['nature']);
  });

  it('omits absent and default values', () => {
    const search = serializeTourSearch({ q: '', destination: [], category: [], sort: '', page: 1 });
    expect(search.toString()).toBe('page=1');
  });

  it('maps the listing price keys to the contract parameter names', () => {
    const search = serializeTourSearch({ priceMin: 1000000, priceMax: 5000000, sort: 'price_asc' });
    expect(search.get('minPrice')).toBe('1000000');
    expect(search.get('maxPrice')).toBe('5000000');
    expect(search.get('sort')).toBe('price_asc');
  });
});
