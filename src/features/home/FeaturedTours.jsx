import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { StateBlock } from '../../components/StateBlock';
import { TourCard, TourCardSkeleton } from '../../components/TourCard';

export function FeaturedTours({ status, tours, onRetry }) {
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

        {status === 'success' && tours.length > 0 ? (
          <div className="card-grid">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
