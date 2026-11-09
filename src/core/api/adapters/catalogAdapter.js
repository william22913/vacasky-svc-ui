// Contract wire shape -> view model. The pages and components never read the
// response's snake_case field names directly.

export function toTour(item) {
  return {
    slug: item.slug,
    name: item.name,
    destination: item.destination,
    category: item.category,
    durationDays: item.duration_days,
    pricePerPerson: item.price_per_person,
    image: { url: item.image_url, alt: item.image_alt },
  };
}

export function toTourDetail(item) {
  return {
    ...toTour(item),
    description: item.description,
    highlights: item.highlights || [],
    included: item.included || [],
    images: (item.images || []).map((image) => ({ url: image.url, alt: image.alt })),
    departureDates: item.departure_dates || [],
  };
}

export function toDestinationCard(item) {
  return {
    slug: item.slug,
    name: item.name,
    image: { url: item.image_url, alt: item.image_alt },
  };
}

export function toDestinationOption(item) {
  return { slug: item.slug, name: item.name };
}

export function toTourPage(payload) {
  return {
    tours: (payload.tours || []).map(toTour),
    page: payload.page,
    pageSize: payload.page_size,
    total: payload.total,
    totalPages: payload.total_pages,
  };
}
