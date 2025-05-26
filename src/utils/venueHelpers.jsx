// Default empty form values for a venue
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

// Converts a string of whitespace-separated URLs into an array of media objects
// Each media object contains the URL and an alt text like "Image 1", "Image 2", etc.
export function convertTextToMedia(text) {
  return text
    .split(/\s+/)      // Split text by any whitespace
    .filter(Boolean)   // Remove empty strings
    .map((url, i) => ({ url, alt: `Image ${i + 1}` }));
}

// Builds the payload object to send to the backend API based on form data
export function buildVenuePayload(data) {
  return {
    name: data.name,
    description: data.description,
    price: Number(data.price),          // Convert to number
    maxGuests: Number(data.maxGuests),  // Convert to number
    rating: Number(data.rating),        // Convert to number
    media: convertTextToMedia(data.mediaText),  // Convert media text to media array
    meta: {                            // Venue metadata (facilities)
      wifi: data.wifi,
      parking: data.parking,
      breakfast: data.breakfast,
      pets: data.pets,
    },
    location: {                       // Venue location details
      address: data.address,
      city: data.city,
      zip: data.zip,
      country: data.country,
      continent: data.continent,
      lat: Number(data.lat),         // Convert to number
      lng: Number(data.lng),         // Convert to number
    },
  };
}

// Normalizes venue data fetched from backend into the shape used by the form
export function normalizeVenueData(venue) {
  return {
    ...emptyVenueForm,            // Start with empty defaults
    ...venue,                    // Overwrite with actual venue data
    mediaText: venue.media?.map((m) => m.url).join("\n\n") || "",  // Join media URLs into text
    wifi: venue.meta?.wifi ?? false,           // Ensure boolean values, fallback false
    parking: venue.meta?.parking ?? false,
    breakfast: venue.meta?.breakfast ?? false,
    pets: venue.meta?.pets ?? false,
    address: venue.location?.address || "",    // Use location data or fallback empty string
    city: venue.location?.city || "",
    zip: venue.location?.zip || "",
    country: venue.location?.country || "",
    continent: venue.location?.continent || "",
    lat: venue.location?.lat ?? 0,              // Fallback to 0 if missing
    lng: venue.location?.lng ?? 0,
  };
}
