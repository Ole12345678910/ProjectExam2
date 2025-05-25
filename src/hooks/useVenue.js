
import { useEffect, useState } from "react";
import { getVenueById } from "../components/api";

export function useVenue(id) {
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState(null);

  const loadVenue = async () => {
    try {
      const response = await getVenueById(id);
      setVenue(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load venue: " + error.message);
    }
  };

  useEffect(() => {
    if (id) loadVenue();
  }, [id]);

  return { venue, error, loadVenue };
}
