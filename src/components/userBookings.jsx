import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenueById } from "../components/api";

export default function VenueDetails() {
  const { id: venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!venueId) {
      setError("Venue ID is missing");
      setLoading(false);
      return;
    }

    const fetchVenue = async () => {
      try {
        const data = await getVenueById(venueId);
        setVenue(data.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  if (loading) return <p>Loading venue...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!venue) return <p>Venue not found</p>;

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
