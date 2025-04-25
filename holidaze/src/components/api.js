/*
const API_URL = 'https://v2.api.noroff.dev/holidaze/bookings';
const apiKey = import.meta.env.VITE_API_KEY;




const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXJteW5hbWUiLCJlbWFpbCI6Im15bmFtZUBzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTc0NTM4NDU4Nn0.yzI3gjXVXofdKLgT60xZrjl1j1AQZOCPxCXzrn0hagg`, // Optional: Add your bearer token here
  'X-Noroff-API-Key': apiKey,
};

// Function to fetch bookings
export const fetchBookings = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers,
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    const data = await response.json();
    return data.data; // Return the bookings data
  } catch (error) {
    throw new Error(error.message); // Propagate error
  }
};

*/

const BASE_URL = 'https://v2.api.noroff.dev/holidaze/bookings';


const apiKey = import.meta.env.VITE_API_KEY;
const TOKEN = import.meta.env.VITE_BEARER_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
  'X-Noroff-API-Key': apiKey,
};

// ✅ Get All Bookings
export async function getAllBookings() {
  const res = await fetch(BASE_URL, { headers });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

// ✅ Get Single Booking
export async function getBooking(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
}

// ✅ Create Booking
export async function createBooking(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

// ✅ Update Booking
export async function updateBooking(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return res.json();
}

// ✅ Delete Booking
export async function deleteBooking(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete booking');
  return true;
}
