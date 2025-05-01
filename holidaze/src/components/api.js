const BASE_URL = 'https://v2.api.noroff.dev/holidaze';


const apiKey = import.meta.env.VITE_API_KEY;
const TOKEN = import.meta.env.VITE_BEARER_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
  'X-Noroff-API-Key': apiKey,
};

// ✅ Get All Bookings
export async function getAllBookings() {
  const res = await fetch(`${BASE_URL}/bookings`, { headers });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

// ✅ Get Single Booking
export async function getBooking(id) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
}

// ✅ Create Booking
export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

// ✅ Update Booking
export async function updateBooking(id, data) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return res.json();
}

// ✅ Delete Booking
export async function deleteBooking(id) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete booking');
  return true;
}


// ✅ Get All Venues
export async function getAllVenues() {
  const res = await fetch(`${BASE_URL}/venues?_bookings=true`, { headers });
  if (!res.ok) throw new Error('Failed to fetch venues');
  return res.json();
}


// ✅ Get Single Venue
export async function getVenue(id) {
  const res = await fetch(`${BASE_URL}/venues/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch venue');
  return res.json();
}



// ✅ Get All Profiles
export async function getAllProfiles() {
  const res = await fetch(`${BASE_URL}/profiles`, { headers });
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}


// ✅ Get Single Profile
export async function getSingleProfile(profileName) {
  const res = await fetch(`${BASE_URL}/profiles/${profileName}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json(); // Return the JSON data
}


// ✅ Search All Profiles
export const searchProfiles = (query) => {
  return fetch(`${BASE_URL}/profiles/search?q=${query}`, { headers })
    .then((response) => {
      if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
        return response.json(); // Parse as JSON
      } else {
        return response.text().then((text) => {
          console.error('Unexpected response format:', text);
          throw new Error('Unexpected response format');
        });
      }
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error('Request failed:', err);
      throw new Error(err.message);
    });
};


// ✅ Get venues with bookings
export async function getVenueWithBookings(id) {
  const res = await fetch(`${BASE_URL}/holidaze/venues/${id}?_bookings=true`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch venue with bookings');
  return res.json();
}


export async function getSingleVenue(id) {
  const res = await fetch(`${BASE_URL}/holidaze/venues/${id}?_bookings=true&_owner=true`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch venue');
  return res.json();
}
