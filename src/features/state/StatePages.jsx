import { Link } from 'react-router-dom';
import { Button } from 'antd';

export function TourNotFoundPage() {
  return (
    <div className="state-page">
      <h1 className="state-page__title">Tour not found</h1>
      <p className="state-page__text">This tour may have been removed or is no longer available.</p>
      <div className="state-page__actions">
        <Link className="ant-btn ant-btn-primary ant-btn-lg ant-btn-round" to="/tours">
          Back to all tours
        </Link>
      </div>
    </div>
  );
}

export function OfflinePage() {
  return (
    <div className="state-page">
      <h1 className="state-page__title">You&apos;re offline</h1>
      <p className="state-page__text">Check your connection and try again.</p>
      <div className="state-page__actions">
        <Button type="primary" shape="round" size="large" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="state-page">
      <h1 className="state-page__title">Page not found</h1>
      <p className="state-page__text">The page you asked for does not exist.</p>
      <div className="state-page__actions">
        <Link className="ant-btn ant-btn-primary ant-btn-lg ant-btn-round" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
