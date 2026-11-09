import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TourCard } from './TourCard';

const tour = {
  slug: 'komodo-sailing-3d2n',
  title: 'Komodo National Park Sailing 3D2N',
  summary: 'Three days aboard a traditional phinisi.',
  destination: { slug: 'labuan-bajo', name: 'Labuan Bajo', country: 'Indonesia' },
  category: { slug: 'sailing', name: 'Sailing' },
  durationDays: 3,
  price: { amount: 4750000, currency: 'IDR' },
  image: { url: 'https://cdn.vacasky.example/images/tour.jpg', alt: 'A phinisi boat' },
  badges: ['best_seller'],
};

describe('TourCard', () => {
  it('links the whole card to the tour detail page', () => {
    render(
      <MemoryRouter>
        <TourCard tour={tour} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: tour.title });
    expect(link).toHaveAttribute('href', '/tours/komodo-sailing-3d2n');
    expect(screen.getByText('Best seller')).toBeInTheDocument();
    expect(screen.getByText(/Rp 4\.750\.000/)).toBeInTheDocument();
    expect(screen.getByText('Labuan Bajo')).toBeInTheDocument();
    expect(screen.getByText('3 days')).toBeInTheDocument();
  });

  it('shows no badge when the contract sends none', () => {
    render(
      <MemoryRouter>
        <TourCard tour={{ ...tour, badges: [] }} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Best seller')).not.toBeInTheDocument();
  });
});
