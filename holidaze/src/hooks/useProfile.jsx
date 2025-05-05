import { useState, useEffect } from "react";
import { getProfileWithDetails } from "../components/api";
export function useProfile(token, username) {
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const data = await getProfileWithDetails(username, token);
      setProfile(data);
      setVenues(data.venues || []);
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (username && token) {
      refresh();
    }
  }, [username, token]);

  return {
    profile,
    venues,
    bookings,
    error,
    refresh,
    setVenues,
  };
}
