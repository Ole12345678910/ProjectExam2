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


export async function getVenueById(id) {
  const res = await fetch(`${BASE_URL}/venues/${id}?_bookings=true&_owner=true`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch venue by ID');
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


export async function loginUser(email, password) {
  const loginData = { email, password };

  const response = await fetch(`https://v2.api.noroff.dev/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401) {
      throw new Error("Invalid email or password.");
    }
    throw new Error(errorData.message || "Login failed.");
  }

  const responseData = await response.json();
  console.log("Login response:", responseData);


  localStorage.setItem("token", responseData.data.accessToken);  
  localStorage.setItem("user", JSON.stringify(responseData.data)); 

  return responseData.data; 
}



export async function createBooking(bookingData) {
  const token = localStorage.getItem('token'); 


  console.log("Token retrieved:", token);

  if (!token) {
    console.error("No token found. Please log in.");
    throw new Error("No token found. Please log in.");
  }


  console.log("Sending booking with token:", token);
  console.log("Booking Data:", bookingData);

  try {
    const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  
        'X-Noroff-API-Key': apiKey,
      },
      body: JSON.stringify(bookingData),  
    });


    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating booking:", errorData);  
      throw new Error(errorData.errors?.[0]?.message || "Failed to create booking");  
    }

    const responseData = await response.json();
    console.log("Booking created successfully:", responseData);
    return responseData;  

  } catch (error) {
  
    console.error("Error in API call:", error);
    throw new Error("API call failed: " + error.message);
  }
}










export async function getProfileWithDetails(username, token) {
  const res = await fetch(
    `${BASE_URL}/profiles/${username}?_venues=true&_bookings=true`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  
        'X-Noroff-API-Key': apiKey,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.statusText}`);
  }

  const { data } = await res.json();
  return data;
}



























export const registerUser = async (userData) => {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/auth/register`, {  
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
};
















export async function createVenue(venueData, token) {
  const response = await fetch(`${BASE_URL}/venues`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(venueData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.errors?.[0]?.message || "Failed to create venue");
  }

  const { data } = await response.json();
  return data;
}











export async function deleteVenue(venueId, token) {
  const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete venue.");
  }

  return response;
}







export async function updateVenue(venueId, updatedData, token) {
  const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update venue.");
  }

  return await response.json();
}
