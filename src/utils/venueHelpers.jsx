export const emptyVenueForm = {
    name: "",
    description: "",
    price: 0,
    maxGuests: 1,
    mediaText: "",
    rating: 0,
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: 0,
    lng: 0,
  };
  
  export function convertTextToMedia(text) {
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((url, i) => ({ url, alt: `Image ${i + 1}` }));
  }
  
  export function buildVenuePayload(data) {
    return {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      maxGuests: Number(data.maxGuests),
      rating: Number(data.rating),
      media: convertTextToMedia(data.mediaText),
      meta: {
        wifi: data.wifi,
        parking: data.parking,
        breakfast: data.breakfast,
        pets: data.pets,
      },
      location: {
        address: data.address,
        city: data.city,
        zip: data.zip,
        country: data.country,
        continent: data.continent,
        lat: Number(data.lat),
        lng: Number(data.lng),
      },
    };
  }
  
  export function normalizeVenueData(venue) {
    return {
      ...emptyVenueForm,
      ...venue,
      mediaText: venue.media?.map((m) => m.url).join("\n\n") || "",
      wifi: venue.meta?.wifi ?? false,
      parking: venue.meta?.parking ?? false,
      breakfast: venue.meta?.breakfast ?? false,
      pets: venue.meta?.pets ?? false,
      address: venue.location?.address || "",
      city: venue.location?.city || "",
      zip: venue.location?.zip || "",
      country: venue.location?.country || "",
      continent: venue.location?.continent || "",
      lat: venue.location?.lat ?? 0,
      lng: venue.location?.lng ?? 0,
    };
  }
  