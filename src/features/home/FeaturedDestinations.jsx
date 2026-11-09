import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { DestinationCard } from '../../components/DestinationCard';
import { StateBlock } from '../../components/StateBlock';

export function FeaturedDestinations({ status, destinations, onRetry }) {
  return (
    <section className="section section--surface" id="destinations" aria-labelledby="featured-destinations-title">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Places</p>
            <h2 className="section__title" id="featured-destinations-title">
              Featured destinations
            </h2>
          </div>
          <Link className="section__link" to="/tours">
            Browse all tours
          </Link>
        </div>

        {status === 'loading' ? (
          <div className="card-grid" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="skeleton" key={index} style={{ aspectRatio: '4 / 3', borderRadius: 'var(--radius-lg)' }} />
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
            We couldn&apos;t load the featured destinations.
          </StateBlock>
        ) : null}

        {status === 'success' && destinations.length === 0 ? (
          <StateBlock
            actions={
              <Link className="ant-btn ant-btn-primary ant-btn-lg ant-btn-round" to="/tours">
                Browse all tours
              </Link>
            }
          >
            Destinations are being added.
          </StateBlock>
        ) : null}

        {status === 'success' && destinations.length > 0 ? (
          <div className="card-grid">
            {destinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
