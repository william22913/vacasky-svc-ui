import { describe, expect, it } from 'vitest';
import {
  toDestinationCard,
  toDestinationOption,
  toTour,
  toTourDetail,
  toTourPage,
} from './catalogAdapter';

const wireTour = {
  slug: 'bali-island-escape',
  name: 'Bali Island Escape',
  destination: { slug: 'bali', name: 'Bali' },
  category: 'Beach',
  duration_days: 5,
  price_per_person: 4500000,
  image_url: 'https://cdn.example/tours/bali-1.jpg',
  image_alt: 'Bali Island Escape beach at sunset',
};

describe('catalogAdapter', () => {
  it('maps the wire tour onto camelCase view fields', () => {
    expect(toTour(wireTour)).toEqual({
      slug: 'bali-island-escape',
      name: 'Bali Island Escape',
      destination: { slug: 'bali', name: 'Bali' },
      category: 'Beach',
      durationDays: 5,
      pricePerPerson: 4500000,
      image: { url: 'https://cdn.example/tours/bali-1.jpg', alt: 'Bali Island Escape beach at sunset' },
    });
  });

  it('maps detail extras and defaults missing arrays', () => {
    const detail = toTourDetail({
      ...wireTour,
      description: 'Five days across Bali.',
      highlights: ['Uluwatu'],
      included: ['Airport transfer'],
      images: [{ url: 'https://cdn.example/a.jpg', alt: 'A' }],
      departure_dates: ['2026-11-20'],
    });

    expect(detail.description).toBe('Five days across Bali.');
    expect(detail.highlights).toEqual(['Uluwatu']);
    expect(detail.included).toEqual(['Airport transfer']);
    expect(detail.images).toEqual([{ url: 'https://cdn.example/a.jpg', alt: 'A' }]);
    expect(detail.departureDates).toEqual(['2026-11-20']);

    const bare = toTourDetail(wireTour);
    expect(bare.highlights).toEqual([]);
    expect(bare.included).toEqual([]);
    expect(bare.images).toEqual([]);
    expect(bare.departureDates).toEqual([]);
  });

  it('maps destination cards and options', () => {
    const card = {
      slug: 'komodo',
      name: 'Komodo',
      image_url: 'https://cdn.example/komodo.jpg',
      image_alt: 'Komodo island coastline',
    };
    expect(toDestinationCard(card)).toEqual({
      slug: 'komodo',
      name: 'Komodo',
      image: { url: 'https://cdn.example/komodo.jpg', alt: 'Komodo island coastline' },
    });
    expect(toDestinationOption(card)).toEqual({ slug: 'komodo', name: 'Komodo' });
  });

  it('maps the paged tour payload', () => {
    const page = toTourPage({
      tours: [wireTour],
      page: 2,
      page_size: 12,
      total: 30,
      total_pages: 3,
    });

    expect(page.tours).toHaveLength(1);
    expect(page.tours[0].pricePerPerson).toBe(4500000);
    expect(page.page).toBe(2);
    expect(page.pageSize).toBe(12);
    expect(page.total).toBe(30);
    expect(page.totalPages).toBe(3);
  });
});
