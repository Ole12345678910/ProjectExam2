import { useEffect, useState } from "react";
import { getVenueById } from "../components/api";

export function useVenue(id) {
  const [venue, setVenue] = useState(null);  // State for venue data
  const [error, setError] = useState(null);  // State for error messages

  const loadVenue = async () => {
    try {
      const response = await getVenueById(id);  // Fetch venue data by id
      setVenue(response.data);                   // Save data to state
      setError(null);                            // Clear any previous errors
    } catch (error) {
      setError("Failed to load venue: " + error.message);  // Set error message
    }
  };

  useEffect(() => {
    if (id) loadVenue();  // When id changes, fetch new venue data
  }, [id]);

  return { venue, error, loadVenue };  // Return data, error, and reload function
}
