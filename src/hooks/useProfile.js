import { useState, useEffect } from "react";
import { getProfileWithDetails } from "../components/api";

// Custom hook to fetch user profile and related details (venues, bookings)
export function useProfile(token, username) {
  // State to hold the user profile data
  const [profile, setProfile] = useState(null);
  // State to hold venues owned or associated with the user
  const [venues, setVenues] = useState([]);
  // State to hold bookings related to the user
  const [bookings, setBookings] = useState([]);
  // State for tracking errors during fetch
  const [error, setError] = useState("");

  // Function that fetches the profile info from API and updates state
  const refresh = async () => {
    try {
      // Call the API passing username and token (likely for auth)
      const data = await getProfileWithDetails(username, token);

      // Update state with the fetched profile data
      setProfile(data);
      // Venues might not always be present, so use fallback empty array
      setVenues(data.venues || []);
      // Same for bookings
      setBookings(data.bookings || []);
    } catch (err) {
      // If API call fails, save error message to show in UI
      setError(err.message || "Something went wrong.");
    }
  };

  // Effect runs whenever username or token changes to refresh profile data
  useEffect(() => {
    // Only refresh if both username and token are provided
    if (username && token) {
      refresh();
    }
  }, [username, token]);

  // Return state and refresh function to component using this hook
  return {
    profile,
    venues,
    bookings,
    error,
    refresh,
    setVenues, // exposed for direct venue state updates if needed
  };
}
