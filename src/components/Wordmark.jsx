import { Link } from 'react-router-dom';

export function Wordmark({ inverse = false }) {
  return (
    <Link
      to="/"
      className="wordmark"
      style={inverse ? { color: 'var(--color-inverse)' } : undefined}
      aria-label="vacasky home"
    >
      VACASKY
    </Link>
  );
}
