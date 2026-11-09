import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { fetchTour } from '../../core/services/catalogService';
import { formatDate, formatDuration, formatIdr, paragraphsOf } from '../../core/utils/format';
import { useApiResource } from '../../helpers/useApiResource';
import { CategoryTag } from '../../components/CategoryTag';
import { MediaImage } from '../../components/MediaImage';
import { StateBlock } from '../../components/StateBlock';
import { TourNotFoundPage } from '../state/StatePages';

// The contract has no enquiry object, so the link is built from the site's
// own contact settings. WhatsApp first, email second.
const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';

function enquiryUrl(tour) {
  const message = `Hi Vacasky, I would like to enquire about ${tour.name}.`;
  if (whatsappNumber) return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  if (contactEmail) {
    return `mailto:${contactEmail}?subject=${encodeURIComponent(`Enquiry: ${tour.name}`)}`;
  }
  return '';
}

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

function EnquiryButton({ tour, className }) {
  const url = enquiryUrl(tour);
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
      icon={<SendOutlined />}
    >
      Enquire about this tour
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
  const paragraphs = paragraphsOf(tour.description);
  const images = tour.images.length > 0 ? tour.images : tour.image?.url ? [tour.image] : [];
  const departureDates = tour.departureDates.map(formatDate).filter(Boolean);

  return (
    <div className="container detail-page">
      <header className="detail-head">
        <div className="detail-head__tags">
          <CategoryTag>{tour.category}</CategoryTag>
        </div>
        <h1 className="detail-head__title">{tour.name}</h1>
        <div className="detail-meta">
          <Link to={`/tours?destination=${encodeURIComponent(tour.destination.slug)}`}>
            {tour.destination.name}
          </Link>
          <span>
            <ClockCircleOutlined aria-hidden="true" /> {formatDuration(tour.durationDays)}
          </span>
        </div>
        <p className="detail-price">
          <strong>{formatIdr(tour.pricePerPerson)}</strong>
          <span>per person</span>
        </p>
      </header>

      <div className="detail-layout">
        <div className="detail-aside">
          {images.length > 0 ? <Gallery images={images} resetKey={tour.slug} /> : null}
          <div className="enquiry-card">
            <p className="enquiry-card__price">From</p>
            <p className="enquiry-card__amount">{formatIdr(tour.pricePerPerson)}</p>
            <p className="enquiry-card__note">
              Tell us your dates and group size. No payment is taken here.
            </p>
            <EnquiryButton tour={tour} />
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

          {tour.included.length > 0 ? (
            <section className="detail-section">
              <h2>What is included</h2>
              <ul className="detail-list detail-list--included">
                {tour.included.map((item) => (
                  <li key={item}>
                    <CheckCircleFilled aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {departureDates.length > 0 ? (
            <section className="detail-section">
              <h2>Departure dates</h2>
              <ul className="detail-list detail-list--departures">
                {departureDates.map((date) => (
                  <li key={date}>
                    <CalendarOutlined aria-hidden="true" />
                    <span>{date}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <div className="enquiry-bar">
        <p className="enquiry-bar__price">
          {formatIdr(tour.pricePerPerson)}
          <span>per person</span>
        </p>
        <EnquiryButton tour={tour} />
      </div>
    </div>
  );
}
