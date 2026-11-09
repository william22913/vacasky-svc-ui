import { fetchHome } from '../../core/services/catalogService';
import { useApiResource } from '../../helpers/useApiResource';
import { FeaturedDestinations } from './FeaturedDestinations';
import { FeaturedTours } from './FeaturedTours';
import { HomeHero } from './HomeHero';

// The hero is painted before data arrives so the first screen never shifts.
// Values mirror the contract's documented hero example.
const FALLBACK_HERO = {
  heading: 'Create unforgettable memories with Vacasky',
  subheading: 'Small-group tours across Indonesia, led by guides who live there.',
};

export function HomePage() {
  const { status, data, retry } = useApiResource(fetchHome, []);

  return (
    <>
      <HomeHero hero={data?.hero || FALLBACK_HERO} />
      {/* The contract asks for at most six of each; never render more. */}
      <FeaturedTours status={status} tours={data?.featuredTours?.slice(0, 6) || []} onRetry={retry} />
      <FeaturedDestinations
        status={status}
        destinations={data?.featuredDestinations?.slice(0, 6) || []}
        onRetry={retry}
      />
    </>
  );
}
