const BASE_URL = 'https://v2.api.noroff.dev/holidaze';
const AUTH_URL = "https://v2.api.noroff.dev/auth/";
const apiKey = import.meta.env.VITE_API_KEY;


// Reusable function to get headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'X-Noroff-API-Key': apiKey,
  };
};
// Reusable function to handle fetch requests
const fetchRequest = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.message || `Request failed: ${res.statusText}`);
  }

  // ✅ Don't parse if status is 204 No Content
  if (res.status === 204) return;

  return res.json();
};

// ✅ Update Profile
export const updateProfile = (profileName, data) => {
  return put(`${BASE_URL}/profiles/${profileName}`, data);
};

// ✅ Search Venues
export const searchVenues = (query) =>
  fetchRequest(`${BASE_URL}/venues/search?q=${encodeURIComponent(query)}`, 'GET');


// Generic function to make GET requests
const get = (url) => fetchRequest(url, 'GET');

// Generic function to make POST requests
const post = (url, body) => fetchRequest(url, 'POST', body);

// Generic function to make PUT requests
const put = (url, body) => fetchRequest(url, 'PUT', body);

// Generic function to make DELETE requests
const del = (url) => fetchRequest(url, 'DELETE');

// ✅ Get All Bookings
export const getAllBookings = () => get(`${BASE_URL}/bookings`);

// ✅ Get Single Booking
export const getBooking = (id) => get(`${BASE_URL}/bookings/${id}`);

// ✅ Update Booking
export const updateBooking = (id, data) => put(`${BASE_URL}/bookings/${id}`, data);

// ✅ Delete Booking
export const deleteBooking = (id) => del(`${BASE_URL}/bookings/${id}`);

// ✅ Get All Venues
export const getAllVenues = () => get(`${BASE_URL}/venues?_bookings=true`);

// ✅ Get Single Venue
export const getVenueById = (id) => get(`${BASE_URL}/venues/${id}?_bookings=true&_owner=true`);

// ✅ Get All Profiles
export const getAllProfiles = () => get(`${BASE_URL}/profiles`);

// ✅ Get Single Profile
export const getSingleProfile = (profileName) => get(`${BASE_URL}/profiles/${profileName}`);

// ✅ Search All Profiles
export const searchProfiles = (query) => get(`${BASE_URL}/profiles/search?q=${query}`);

// ✅ Create Booking
export const createBooking = (bookingData) =>
  fetchRequest(`${BASE_URL}/bookings`, 'POST', bookingData);

// ✅ Create Venue
export const createVenue = (venueData) => post(`${BASE_URL}/venues`, venueData);

// ✅ Delete Venue
export const deleteVenue = (venueId) => del(`${BASE_URL}/venues/${venueId}`);

// ✅ Update Venue
export const updateVenue = (venueId, updatedData) => put(`${BASE_URL}/venues/${venueId}`, updatedData);

// ✅ Login User
export const loginUser = async (email, password) => {
  const loginData = { email, password };
  
  const response = await fetch(`${AUTH_URL}login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    const error = new Error("Server response is not JSON.");
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || `Login failed`);
    error.status = response.status;
    throw error;
  }

  localStorage.setItem("token", data.data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.data));

  return data.data;
};

// ✅ Get User
export const getProfile = async (username) => {
  const response = await get(`${BASE_URL}/profiles/${username}?_venues=true&_bookings=true`);
  return response.data;
};

export const getProfileWithDetails = async (username) => {
  const profileRes = await get(`${BASE_URL}/profiles/${username}?_venues=true`);
  const profile = profileRes.data;

  const venuesWithBookings = await Promise.all(
    (profile.venues || []).map(async (venue) => {
const res = await get(`${BASE_URL}/venues/${venue.id}?_bookings=true&_customer=true`);
      return res.data;
    })
  );

  return {
    ...profile,
    venues: venuesWithBookings,
  };
};

// ✅ Register User
export async function registerUser(userData) {
  try {
    const response = await fetch(`${AUTH_URL}register`, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      return data; // Success
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    throw new Error(error.message || 'An error occurred while registering');
  }
}
