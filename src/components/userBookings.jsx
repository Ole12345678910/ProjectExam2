import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenueById } from "../components/api";

export default function VenueDetails() {
  // Get venue ID from URL parameters
  const { id: venueId } = useParams();
  
  // State to store venue data, error message, and loading status
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no venue ID is provided, set error and stop loading
    if (!venueId) {
      setError("Venue ID is missing");
      setLoading(false);
      return;
    }

    // Async function to fetch venue data by ID
    const fetchVenue = async () => {
      try {
        const data = await getVenueById(venueId);
        setVenue(data.data); // Store the venue data
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchVenue();
  }, [venueId]);

  // Show loading message while fetching data
  if (loading) return <p>Loading venue...</p>;

  // Show error message if fetch failed
  if (error) return <p>Error: {error}</p>;

  // Show message if venue was not found
  if (!venue) return <p>Venue not found</p>;

  // Render venue bookings or a message if none exist
  return (
    <div>
      <h2>Bookings</h2>
      {venue.bookings?.length ? (
        venue.bookings.map((booking) => (
          <div key={booking.id}>
            <p><strong>From:</strong> {booking.dateFrom}</p>
            <p><strong>To:</strong> {booking.dateTo}</p>
            <p><strong>Customer:</strong> {booking.customer?.name}</p>
          </div>
        ))
      ) : (
        <p>No bookings yet.</p>
      )}
    </div>
  );
}
