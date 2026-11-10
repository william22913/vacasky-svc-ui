// Generated from the approved API contract (version 3). Do not edit; regenerate when the contract changes.
import http from 'node:http';

const routes = [
  {
    method: 'GET',
    path: '/v1/home/featured-tours',
    status: 200,
    body: {
      success: true,
      header: {
        request_id: 'req_01JB7Z9K4Q8X2M6T3R5V1W0P',
        version: '1.0.0',
        timestamp: '2026-11-09T00:00:00.000000Z',
      },
      payload: {
        tours: [
          {
            slug: 'bali-island-escape',
            name: 'Bali Island Escape',
            destination: { slug: 'bali', name: 'Bali' },
            category: 'Beach',
            duration_days: 5,
            price_per_person: 4500000,
            image_url: 'https://cdn.example/tours/bali-1.jpg',
            image_alt: 'Bali Island Escape beach at sunset',
          },
          {
            slug: 'komodo-sailing-adventure',
            name: 'Komodo Sailing Adventure',
            destination: { slug: 'komodo', name: 'Komodo' },
            category: 'Adventure',
            duration_days: 3,
            price_per_person: 6200000,
            image_url: 'https://cdn.example/tours/komodo-1.jpg',
            image_alt: 'A phinisi boat sailing off Komodo Island',
          },
        ],
      },
    },
  },
  {
    method: 'GET',
    path: '/v1/home/featured-destinations',
    status: 200,
    body: {
      success: true,
      header: {
        request_id: 'req_01JB7Z9K4Q8X2M6T3R5V1W0Q',
        version: '1.0.0',
        timestamp: '2026-11-09T00:00:00.000000Z',
      },
      payload: {
        destinations: [
          {
            slug: 'komodo',
            name: 'Komodo',
            image_url: 'https://cdn.example/destinations/komodo.jpg',
            image_alt: 'Komodo island coastline',
          },
          {
            slug: 'bali',
            name: 'Bali',
            image_url: 'https://cdn.example/destinations/bali.jpg',
            image_alt: 'Rice terraces in Bali',
          },
        ],
      },
    },
  },
  {
    method: 'GET',
    path: '/v1/tours',
    status: 200,
    body: {
      success: true,
      header: {
        request_id: 'req_01JB7Z9K4Q8X2M6T3R5V1W0R',
        version: '1.0.0',
        timestamp: '2026-11-09T00:00:00.000000Z',
      },
      payload: {
        tours: [
          {
            slug: 'bali-island-escape',
            name: 'Bali Island Escape',
            destination: { slug: 'bali', name: 'Bali' },
            category: 'Beach',
            duration_days: 5,
            price_per_person: 4500000,
            image_url: 'https://cdn.example/tours/bali-1.jpg',
            image_alt: 'Bali Island Escape beach at sunset',
          },
          {
            slug: 'lombok-mountain-trek',
            name: 'Lombok Mountain Trek',
            destination: { slug: 'lombok', name: 'Lombok' },
            category: 'Mountain',
            duration_days: 4,
            price_per_person: 3800000,
            image_url: 'https://cdn.example/tours/lombok-1.jpg',
            image_alt: 'Mount Rinjani seen from a ridge in Lombok',
          },
        ],
        page: 1,
        page_size: 12,
        total: 30,
        total_pages: 3,
      },
    },
  },
  {
    method: 'GET',
    path: '/v1/tours/{slug}',
    status: 200,
    body: {
      success: true,
      header: {
        request_id: 'req_01JB7Z9K4Q8X2M6T3R5V1W0S',
        version: '1.0.0',
        timestamp: '2026-11-09T00:00:00.000000Z',
      },
      payload: {
        slug: 'bali-island-escape',
        name: 'Bali Island Escape',
        destination: { slug: 'bali', name: 'Bali' },
        category: 'Beach',
        duration_days: 5,
        price_per_person: 4500000,
        description: "Five days across Bali's south coast, from Uluwatu to Ubud.",
        highlights: [
          'Uluwatu temple at sunset',
          'Rice terraces in Ubud',
          'Snorkelling at Nusa Penida',
        ],
        included: [
          'Airport transfer',
          'Four nights of accommodation',
          'Daily breakfast',
          'Licensed local guide',
        ],
        images: [
          {
            url: 'https://cdn.example/tours/bali-1.jpg',
            alt: 'Bali Island Escape beach at sunset',
          },
          { url: 'https://cdn.example/tours/bali-2.jpg', alt: 'Rice terraces in Ubud' },
          {
            url: 'https://cdn.example/tours/bali-3.jpg',
            alt: 'Snorkellers above a coral reef at Nusa Penida',
          },
        ],
        departure_dates: ['2026-11-20', '2026-12-04', '2026-12-18'],
      },
    },
  },
  {
    method: 'GET',
    path: '/v1/destinations',
    status: 200,
    body: {
      success: true,
      header: {
        request_id: 'req_01JB7Z9K4Q8X2M6T3R5V1W0T',
        version: '1.0.0',
        timestamp: '2026-11-09T00:00:00.000000Z',
      },
      payload: {
        destinations: [
          { slug: 'bali', name: 'Bali' },
          { slug: 'flores', name: 'Flores' },
          { slug: 'jakarta', name: 'Jakarta' },
          { slug: 'komodo', name: 'Komodo' },
          { slug: 'lombok', name: 'Lombok' },
          { slug: 'yogyakarta', name: 'Yogyakarta' },
        ],
      },
    },
  },
  {
    method: 'GET',
    path: '/v1/health',
    status: 200,
    body: { status: 'UP', db: 'UP' },
  },
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rx = (path) =>
  new RegExp(
    '^' +
      path
        .split('/')
        .map((segment) => (/^\{[^}]+\}$/.test(segment) ? '[^/]+' : escapeRegExp(segment)))
        .join('/') +
      '/?$'
  );

const compiled = routes.map((route) => ({ ...route, re: rx(route.path) }));
const port = Number(process.argv[2] || 4010);

http
  .createServer((req, res) => {
    const pathname = (req.url || '/').split('?')[0];
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-headers', '*');
    res.setHeader('access-control-allow-methods', '*');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }
    const hit = compiled.find((route) => route.method === req.method && route.re.test(pathname));
    if (!hit) {
      res.writeHead(404, { 'content-type': 'application/json' });
      return res.end('{"error":"not in contract"}');
    }
    res.writeHead(hit.status, { 'content-type': 'application/json' });
    res.end(hit.body === null ? '' : JSON.stringify(hit.body));
  })
  .listen(port, () => console.log('mock server on :' + port));
