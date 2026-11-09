import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { fetchTour } from '../../core/services/catalogService';
import { badgeLabel, formatDuration, formatIdr, paragraphsOf } from '../../core/utils/format';
import { useApiResource } from '../../helpers/useApiResource';
import { CategoryTag } from '../../components/CategoryTag';
import { MediaImage } from '../../components/MediaImage';
import { StateBlock } from '../../components/StateBlock';
import { TourNotFoundPage } from '../state/StatePages';

function Gallery({ images, resetKey }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [resetKey]);

  const lead = images[Math.min(active, images.length - 1)] || images[0];

  return (
    <div className="gallery">
      <div className="gallery__lead">
        <MediaImage image={lead} eager />
      </div>
      {images.length > 1 ? (
        <div className="gallery__thumbs" role="group" aria-label="Tour photos">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              className="gallery__thumb"
              aria-pressed={index === active}
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              onClick={() => setActive(index)}
            >
              <MediaImage image={image} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EnquiryButton({ enquiry, className }) {
  const url = enquiry?.url || '';
  if (!/^(https:\/\/|mailto:)/.test(url)) return null;

  return (
    <Button
      className={className}
      type="primary"
      shape="round"
      size="large"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {enquiry.label || 'Enquire about this tour'}
    </Button>
  );
}

function DetailSkeleton() {
  return (
    <div className="container detail-page" aria-hidden="true">
      <div className="detail-head">
        <div className="skeleton skeleton-line skeleton-line--short" style={{ marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 48, width: '70%', marginBottom: 20 }} />
        <div className="skeleton skeleton-line skeleton-line--medium" />
      </div>
      <div className="detail-layout">
        <div className="skeleton" style={{ aspectRatio: '4 / 3', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton-card__body">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--medium" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--short" />
        </div>
      </div>
    </div>
  );
}

export function TourDetailPage() {
  const { slug } = useParams();
  const { status, data, error, retry } = useApiResource((signal) => fetchTour(slug, signal), [slug]);

  if (status === 'loading') return <DetailSkeleton />;

  if (status === 'error') {
    if (error?.code === 'TOUR_NOT_FOUND' || error?.status === 404) {
      return <TourNotFoundPage />;
    }
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
        <h1 className="visually-hidden">Tour details</h1>
        <StateBlock
          tone="error"
          actions={
            <Button type="primary" shape="round" onClick={retry}>
              Try again
            </Button>
          }
        >
          We couldn&apos;t load this tour. Please try again.
        </StateBlock>
      </div>
    );
  }

  const tour = data;
  const badge = badgeLabel(tour.badges?.[0]);
  const paragraphs = paragraphsOf(tour.description);

  return (
    <div className="container detail-page">
      <header className="detail-head">
        <div className="detail-head__tags">
          {badge ? <span className="tag tag--accent">{badge}</span> : null}
          <CategoryTag>{tour.category?.name}</CategoryTag>
        </div>
        <h1 className="detail-head__title">{tour.title}</h1>
        <p className="detail-head__summary">{tour.summary}</p>
        <div className="detail-meta">
          <Link to={`/tours?destination=${encodeURIComponent(tour.destination.slug)}`}>
            {tour.destination.name}
          </Link>
          <span>{formatDuration(tour.durationDays)}</span>
          <span>{tour.destination.country}</span>
        </div>
        <p className="detail-price">
          <strong>{formatIdr(tour.price.amount)}</strong>
          <span>per person</span>
        </p>
      </header>

      <div className="detail-layout">
        <div className="detail-aside">
          <Gallery images={tour.images} resetKey={tour.slug} />
          <div className="enquiry-card">
            <p className="enquiry-card__price">From</p>
            <p className="enquiry-card__amount">{formatIdr(tour.price.amount)}</p>
            <p className="enquiry-card__note">
              Tell us your dates and group size. No payment is taken here.
            </p>
            <EnquiryButton enquiry={tour.enquiry} />
          </div>
        </div>

        <div className="detail-body">
          {paragraphs.length > 0 ? (
            <section className="detail-section">
              <h2>About this tour</h2>
              {paragraphs.map((paragraph, index) => (
                <p key={index} style={{ marginBottom: 'var(--space-3)' }}>
                  {paragraph}
                </p>
              ))}
            </section>
          ) : null}

          {tour.highlights.length > 0 ? (
            <section className="detail-section">
              <h2>Highlights</h2>
              <ul className="detail-list">
                {tour.highlights.map((item) => (
                  <li key={item}>
                    <CheckCircleFilled aria-hidden="true" style={{ color: 'var(--color-primary)' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tour.itinerary.length > 0 ? (
            <section className="detail-section">
              <h2>Day by day</h2>
              <ol className="itinerary">
                {tour.itinerary.map((day) => (
                  <li className="itinerary__day" key={day.day}>
                    <span className="itinerary__label">Day {day.day}</span>
                    <span className="itinerary__title">{day.title}</span>
                    <span className="itinerary__text">{day.description}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {tour.inclusions.length > 0 ? (
            <section className="detail-section">
              <h2>What is included</h2>
              <ul className="detail-list detail-list--included">
                {tour.inclusions.map((item) => (
                  <li key={item}>
                    <CheckCircleFilled aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tour.exclusions.length > 0 ? (
            <section className="detail-section">
              <h2>Not included</h2>
              <ul className="detail-list detail-list--excluded">
                {tour.exclusions.map((item) => (
                  <li key={item}>
                    <CloseCircleFilled aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <div className="enquiry-bar">
        <p className="enquiry-bar__price">
          {formatIdr(tour.price.amount)}
          <span>per person</span>
        </p>
        <EnquiryButton enquiry={tour.enquiry} />
      </div>
    </div>
  );
}
