// Generated from the approved API contract. Do not edit; regenerate when the contract changes.
import http from 'node:http';
const routes = [
  {
    "method": "GET",
    "path": "/api/v1/home",
    "status": 200,
    "body": {
      "hero": {
        "heading": "Create unforgettable memories with Vacasky",
        "subheading": "Small-group tours across Indonesia, led by guides who live there.",
        "image": {
          "url": "https://cdn.vacasky.example/images/hero-komodo.jpg",
          "alt": "A wooden phinisi boat sailing between the islands of Komodo National Park at golden hour"
        }
      },
      "featuredDestinations": [
        {
          "slug": "bali",
          "name": "Bali",
          "country": "Indonesia",
          "summary": "Rice terraces at dawn, temple ceremonies and warm surf on the south coast.",
          "image": {
            "url": "https://cdn.vacasky.example/images/destination-bali.jpg",
            "alt": "Green rice terraces stepping down a hillside in Ubud, Bali"
          },
          "tourCount": 14
        },
        {
          "slug": "labuan-bajo",
          "name": "Labuan Bajo",
          "country": "Indonesia",
          "summary": "The harbour gateway to Komodo National Park and its pink beaches.",
          "image": {
            "url": "https://cdn.vacasky.example/images/destination-labuan-bajo.jpg",
            "alt": "Turquoise water and a wooden jetty in Labuan Bajo harbour"
          },
          "tourCount": 9
        }
      ],
      "featuredTours": [
        {
          "slug": "komodo-sailing-3d2n",
          "title": "Komodo National Park Sailing 3D2N",
          "summary": "Three days aboard a traditional phinisi, island-hopping from Padar to Komodo.",
          "destination": {
            "slug": "labuan-bajo",
            "name": "Labuan Bajo",
            "country": "Indonesia"
          },
          "category": {
            "slug": "sailing",
            "name": "Sailing"
          },
          "durationDays": 3,
          "price": {
            "amount": 4750000,
            "currency": "IDR"
          },
          "image": {
            "url": "https://cdn.vacasky.example/images/tour-komodo-sailing.jpg",
            "alt": "The deck of a phinisi boat with Padar Island in the background"
          },
          "badges": [
            "best_seller"
          ]
        },
        {
          "slug": "bromo-sunrise-trek-2d1n",
          "title": "Mount Bromo Sunrise Trek 2D1N",
          "summary": "A pre-dawn jeep ride to the viewpoint, then a walk across the sand sea to the crater rim.",
          "destination": {
            "slug": "bromo",
            "name": "Bromo",
            "country": "Indonesia"
          },
          "category": {
            "slug": "nature",
            "name": "Nature"
          },
          "durationDays": 2,
          "price": {
            "amount": 1250000,
            "currency": "IDR"
          },
          "image": {
            "url": "https://cdn.vacasky.example/images/tour-bromo-sunrise.jpg",
            "alt": "Mount Bromo smoking at sunrise seen from the Penanjakan viewpoint"
          },
          "badges": []
        }
      ]
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/tours",
    "status": 200,
    "body": {
      "data": [
        {
          "slug": "komodo-sailing-3d2n",
          "title": "Komodo National Park Sailing 3D2N",
          "summary": "Three days aboard a traditional phinisi, island-hopping from Padar to Komodo.",
          "destination": {
            "slug": "labuan-bajo",
            "name": "Labuan Bajo",
            "country": "Indonesia"
          },
          "category": {
            "slug": "sailing",
            "name": "Sailing"
          },
          "durationDays": 3,
          "price": {
            "amount": 4750000,
            "currency": "IDR"
          },
          "image": {
            "url": "https://cdn.vacasky.example/images/tour-komodo-sailing.jpg",
            "alt": "The deck of a phinisi boat with Padar Island in the background"
          },
          "badges": [
            "best_seller"
          ]
        },
        {
          "slug": "raja-ampat-dive-6d5n",
          "title": "Raja Ampat Dive Expedition 6D5N",
          "summary": "Six days of reefs, manta rays and island walks from a small dive resort in Kri.",
          "destination": {
            "slug": "raja-ampat",
            "name": "Raja Ampat",
            "country": "Indonesia"
          },
          "category": {
            "slug": "nature",
            "name": "Nature"
          },
          "durationDays": 6,
          "price": {
            "amount": 12500000,
            "currency": "IDR"
          },
          "image": {
            "url": "https://cdn.vacasky.example/images/tour-raja-ampat.jpg",
            "alt": "A manta ray gliding over a coral reef in the Raja Ampat archipelago"
          },
          "badges": []
        }
      ],
      "meta": {
        "page": 1,
        "pageSize": 12,
        "totalItems": 2,
        "totalPages": 1
      }
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/tours/filters",
    "status": 200,
    "body": {
      "destinations": [
        {
          "slug": "bali",
          "name": "Bali",
          "country": "Indonesia",
          "summary": "Rice terraces at dawn, temple ceremonies and warm surf on the south coast.",
          "image": {
            "url": "https://cdn.vacasky.example/images/destination-bali.jpg",
            "alt": "Green rice terraces stepping down a hillside in Ubud, Bali"
          },
          "tourCount": 14
        },
        {
          "slug": "labuan-bajo",
          "name": "Labuan Bajo",
          "country": "Indonesia",
          "summary": "The harbour gateway to Komodo National Park and its pink beaches.",
          "image": {
            "url": "https://cdn.vacasky.example/images/destination-labuan-bajo.jpg",
            "alt": "Turquoise water and a wooden jetty in Labuan Bajo harbour"
          },
          "tourCount": 9
        }
      ],
      "categories": [
        {
          "slug": "sailing",
          "name": "Sailing",
          "tourCount": 4
        },
        {
          "slug": "nature",
          "name": "Nature",
          "tourCount": 6
        },
        {
          "slug": "city",
          "name": "City",
          "tourCount": 3
        },
        {
          "slug": "seasonal",
          "name": "Seasonal",
          "tourCount": 2
        }
      ],
      "priceRange": {
        "minAmount": 850000,
        "maxAmount": 18750000,
        "currency": "IDR"
      },
      "durationRange": {
        "minDays": 1,
        "maxDays": 9
      }
    }
  },
  {
    "method": "GET",
    "path": "/api/v1/tours/{slug}",
    "status": 200,
    "body": {
      "slug": "komodo-sailing-3d2n",
      "title": "Komodo National Park Sailing 3D2N",
      "summary": "Three days aboard a traditional phinisi, island-hopping from Padar to Komodo.",
      "description": "Sail from Labuan Bajo across the Komodo archipelago on a wooden\nphinisi. The trip is built for small groups of up to twelve\nguests, with two nights on board, freshly cooked meals and\nsnorkelling stops between the islands. Your guide is a licensed\nKomodo ranger who grew up on Flores.\n",
      "destination": {
        "slug": "labuan-bajo",
        "name": "Labuan Bajo",
        "country": "Indonesia"
      },
      "category": {
        "slug": "sailing",
        "name": "Sailing"
      },
      "durationDays": 3,
      "price": {
        "amount": 4750000,
        "currency": "IDR"
      },
      "badges": [
        "best_seller"
      ],
      "images": [
        {
          "url": "https://cdn.vacasky.example/images/tour-komodo-sailing-1.jpg",
          "alt": "The deck of a phinisi boat with Padar Island in the background"
        },
        {
          "url": "https://cdn.vacasky.example/images/tour-komodo-sailing-2.jpg",
          "alt": "A Komodo dragon walking along a sandy track"
        },
        {
          "url": "https://cdn.vacasky.example/images/tour-komodo-sailing-3.jpg",
          "alt": "Snorkellers above a coral reef in clear turquoise water"
        }
      ],
      "highlights": [
        "Sunrise from the Padar Island viewpoint",
        "Snorkelling at Pink Beach and Manta Point",
        "Komodo dragons with a licensed ranger"
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Labuan Bajo to Kelor Island",
          "description": "Board the boat at midday, sail to Kelor for the first snorkel and a short hike, then dinner on deck."
        },
        {
          "day": 2,
          "title": "Padar, Pink Beach and Komodo Island",
          "description": "Pre-dawn hike on Padar, snorkelling at Pink Beach and an afternoon ranger-led walk on Komodo Island."
        },
        {
          "day": 3,
          "title": "Manta Point and return",
          "description": "Morning snorkel with manta rays at Manta Point, lunch on board and return to Labuan Bajo by 14:00."
        }
      ],
      "inclusions": [
        "Two nights in an air-conditioned cabin",
        "All meals, drinking water and coffee",
        "Licensed guide and Komodo ranger fees",
        "Snorkelling equipment and life jackets"
      ],
      "exclusions": [
        "Flights to and from Labuan Bajo",
        "Travel insurance",
        "Personal expenses and tips"
      ],
      "enquiry": {
        "label": "Enquire on WhatsApp",
        "url": "https://wa.me/6281234567890?text=Hi%20Vacasky%2C%20I%20would%20like%20to%20enquire%20about%20the%20Komodo%20National%20Park%20Sailing%203D2N%20tour."
      }
    }
  },
  {
    "method": "GET",
    "path": "/healthz",
    "status": 200,
    "body": {
      "status": "ok",
      "version": "1.0.0",
      "checks": {
        "database": "ok"
      }
    }
  }
];
const rx = (p) => new RegExp('^' + p.split('/').map((s) => (/^\{[^}]+\}$/.test(s) ? '[^/]+' : s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('/') + '/?$');
const compiled = routes.map((r) => ({ ...r, re: rx(r.path) }));
const port = Number(process.argv[2] || 4010);
http.createServer((req, res) => {
  const pathname = (req.url || '/').split('?')[0];
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const hit = compiled.find((r) => r.method === req.method && r.re.test(pathname));
  if (!hit) { res.writeHead(404, { 'content-type': 'application/json' }); return res.end('{"error":"not in contract"}'); }
  res.writeHead(hit.status, { 'content-type': 'application/json' });
  res.end(hit.body === null ? '' : JSON.stringify(hit.body));
}).listen(port, () => console.log('mock server on :' + port));
