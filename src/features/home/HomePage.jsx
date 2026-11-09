import {
  fetchFeaturedDestinations,
  fetchFeaturedTours,
} from '../../core/services/catalogService';
import { useApiResource } from '../../helpers/useApiResource';
import { FeaturedDestinations } from './FeaturedDestinations';
import { FeaturedTours } from './FeaturedTours';
import { HomeHero } from './HomeHero';

export function HomePage() {
  // Two contract endpoints, two independent sections: one can fail and retry
  // without replacing the hero or the other section.
  const tours = useApiResource(fetchFeaturedTours, []);
  const destinations = useApiResource(fetchFeaturedDestinations, []);

  return (
    <>
      <HomeHero />
      <FeaturedTours status={tours.status} tours={tours.data || []} onRetry={tours.retry} />
      <FeaturedDestinations
        status={destinations.status}
        destinations={destinations.data || []}
        onRetry={destinations.retry}
      />
    </>
  );
}
