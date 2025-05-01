import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllVenues } from '../components/api';

function DetailVenues() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState('');
  const [showAllBookings, setShowAllBookings] = useState(false);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const allVenues = await getAllVenues('?&_bookings=true');
        const foundVenue = allVenues.data.find((v) => v.id === id);
        if (foundVenue) {
          setVenue(foundVenue);
        } else {
          setError('Venue not found');
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchVenue();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!venue) return <p>Loading...</p>;

  const sortedBookings = [...venue.bookings].sort(
    (a, b) => new Date(b.dateFrom) - new Date(a.dateFrom)
  );

  const visibleBookings = showAllBookings
    ? sortedBookings
    : sortedBookings.slice(0, 5);

  return (
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Price: ${venue.price}</p>
      <p>Max Guests: {venue.maxGuests}</p>
      <p>Rating: {venue.rating}</p>

      {venue.media?.[0] && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt}
          width="300"
        />
      )}

      <h3>Location:</h3>
      <p>
        {venue.location.address}, {venue.location.city},{' '}
        {venue.location.country}
      </p>

      <h3>Facilities:</h3>
      <ul>
        <li>Wifi: {venue.meta.wifi ? 'Yes' : 'No'}</li>
        <li>Parking: {venue.meta.parking ? 'Yes' : 'No'}</li>
        <li>Breakfast: {venue.meta.breakfast ? 'Yes' : 'No'}</li>
        <li>Pets: {venue.meta.pets ? 'Yes' : 'No'}</li>
      </ul>

      <h3>Bookings ({venue.bookings.length} total):</h3>
      {venue.bookings.length > 0 ? (
        <>
          <ul>
            {visibleBookings.map((booking) => (
              <li key={booking.id}>
                <strong>
                  From: {new Date(booking.dateFrom).toLocaleDateString()} — To:{' '}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </strong>
                <br />
                Guests: {booking.guests}
              </li>
            ))}
          </ul>
          {venue.bookings.length > 5 && (
            <button onClick={() => setShowAllBookings(!showAllBookings)}>
              {showAllBookings ? 'Hide bookings' : 'Show all bookings'}
            </button>
          )}
        </>
      ) : (
        <p>No bookings found for this venue.</p>
      )}
    </div>
  );
}

export default DetailVenues;
