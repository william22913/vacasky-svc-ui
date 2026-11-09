import { Link } from 'react-router-dom';
import { formatDuration, formatIdr, badgeLabel } from '../core/utils/format';
import { CategoryTag } from './CategoryTag';
import { MediaImage } from './MediaImage';

export function TourCard({ tour }) {
  const badge = badgeLabel(tour.badges?.[0]);

  return (
    <article className="tour-card">
      <div className="tour-card__media">
        <MediaImage image={tour.image} />
        {badge ? <span className="tour-card__badge">{badge}</span> : null}
      </div>
      <div className="tour-card__body">
        <CategoryTag>{tour.category?.name}</CategoryTag>
        <h3 className="tour-card__title">
          <Link className="tour-card__link" to={`/tours/${tour.slug}`}>
            {tour.title}
          </Link>
        </h3>
        <p className="tour-card__meta">
          <span>{tour.destination?.name}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDuration(tour.durationDays)}</span>
        </p>
        <p className="tour-card__price">
          From {formatIdr(tour.price?.amount)} <small>per person</small>
        </p>
      </div>
    </article>
  );
}

export function TourCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__media skeleton" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-line skeleton-line--short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-line--medium" />
        <div className="skeleton skeleton-line skeleton-line--short" />
      </div>
    </div>
  );
}
