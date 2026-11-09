import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { StateBlock } from '../../components/StateBlock';
import { TourCard, TourCardSkeleton } from '../../components/TourCard';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'best_seller', label: 'Best seller' },
  { key: 'nature', label: 'Nature' },
  { key: 'city', label: 'City' },
  { key: 'seasonal', label: 'Seasonal' },
];

function matchesTab(tour, tab) {
  if (tab === 'all') return true;
  if (tab === 'best_seller') return (tour.badges || []).includes('best_seller');
  return tour.category?.slug === tab;
}

export function FeaturedTours({ status, tours, onRetry }) {
  const [tab, setTab] = useState('all');
  const visible = tours.filter((tour) => matchesTab(tour, tab));

  return (
    <section className="section" aria-labelledby="featured-tours-title">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Packages</p>
            <h2 className="section__title" id="featured-tours-title">
              Featured tours
            </h2>
          </div>
          <Link className="section__link" to="/tours">
            View all tours
          </Link>
        </div>

        <div className="tabs" role="group" aria-label="Filter featured tours">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className="tab"
              aria-pressed={tab === item.key}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {status === 'loading' ? (
          <div className="card-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <TourCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {status === 'error' ? (
          <StateBlock
            tone="error"
            actions={
              <Button type="primary" shape="round" onClick={onRetry}>
                Retry
              </Button>
            }
          >
            We couldn&apos;t load the featured tours.
          </StateBlock>
        ) : null}

        {status === 'success' && tours.length === 0 ? (
          <StateBlock
            actions={
              <Link className="ant-btn ant-btn-primary ant-btn-lg ant-btn-round" to="/tours">
                Browse all tours
              </Link>
            }
          >
            New tours are on the way.
          </StateBlock>
        ) : null}

        {status === 'success' && tours.length > 0 && visible.length === 0 ? (
          <StateBlock
            actions={
              <Button type="primary" shape="round" onClick={() => setTab('all')}>
                See all featured tours
              </Button>
            }
          >
            No featured tours in this collection yet.
          </StateBlock>
        ) : null}

        {status === 'success' && visible.length > 0 ? (
          <div className="card-grid">
            {visible.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
