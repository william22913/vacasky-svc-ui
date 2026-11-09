import { Link } from 'react-router-dom';
import { formatCount } from '../core/utils/format';
import { MediaImage } from './MediaImage';

export function DestinationCard({ destination }) {
  return (
    <article className="destination-card">
      <div className="destination-card__media">
        <MediaImage image={destination.image} />
      </div>
      <div className="destination-card__body">
        <h3 className="destination-card__name">
          <Link className="destination-card__link" to={`/tours?destination=${encodeURIComponent(destination.slug)}`}>
            {destination.name}
          </Link>
        </h3>
        <p className="destination-card__meta">
          {formatCount(destination.tourCount, 'tour')} in {destination.country}
        </p>
        <span className="destination-card__cta" aria-hidden="true">
          Explore {destination.name} →
        </span>
      </div>
    </article>
  );
}
