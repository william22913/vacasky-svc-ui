import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TourCard } from './TourCard';

const tour = {
  slug: 'komodo-sailing-adventure',
  name: 'Komodo Sailing Adventure',
  destination: { slug: 'komodo', name: 'Komodo' },
  category: 'Adventure',
  durationDays: 3,
  pricePerPerson: 6200000,
  image: { url: 'https://cdn.example/tours/komodo-1.jpg', alt: 'A phinisi boat' },
};

describe('TourCard', () => {
  it('links the whole card to the tour detail page and shows the contract fields', () => {
    render(
      <MemoryRouter>
        <TourCard tour={tour} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: tour.name });
    expect(link).toHaveAttribute('href', '/tours/komodo-sailing-adventure');
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('Komodo')).toBeInTheDocument();
    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText(/Rp 6\.200\.000/)).toBeInTheDocument();
  });

  it('keeps the image alt text from the contract', () => {
    render(
      <MemoryRouter>
        <TourCard tour={tour} />
      </MemoryRouter>
    );
    expect(screen.getByAltText('A phinisi boat')).toBeInTheDocument();
  });
});
