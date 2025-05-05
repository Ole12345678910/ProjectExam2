import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // Import the calendar
import { getVenueById, createBooking } from '../components/api'; // Ensure createBooking function is imported

function DetailVenues() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState('');
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [guests, setGuests] = useState(0);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await getVenueById(id);
        setVenue(response.data);
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


  const onChange = (dates) => {
    if (Array.isArray(dates)) {
      setSelectedDates(dates);
    } else {
      setSelectedDates([dates]); 
    }
  };


  const handleBooking = async () => {
    if (selectedDates.length !== 2 || guests <= 0) {
      alert('Please select valid dates and guests count.');
      return;
    }
  
    const [dateFrom, dateTo] = selectedDates;
  
    try {
      const bookingData = {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests,
        venueId: id,
      };
  
      console.log("Booking Data to send:", bookingData);
  
      const response = await createBooking(bookingData);
      setShowBookingSuccess(true);
      alert('Booking successful!');
    } catch (err) {
      console.error("Failed to create booking:", err);
      setError('Failed to create booking');
      alert('There was an error with your booking. Please try again.');
    }
  };
  


  const bookedDates = venue?.bookings.map((booking) => {
    const dates = [];
    let currentDate = new Date(booking.dateFrom);
    const endDate = new Date(booking.dateTo);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }).flat() || [];


  const tileClassName = ({ date }) => {
    const isBooked = bookedDates.some(
      (bookedDate) =>
        date.getDate() === bookedDate.getDate() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getFullYear() === bookedDate.getFullYear()
    );
    return isBooked ? 'highlighted-booked' : '';
  };


  const tileDisabled = ({ date }) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getDate() === bookedDate.getDate() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getFullYear() === bookedDate.getFullYear()
    );
  };

  return (
    <div>
      <h1>{venue.name}</h1>
      <p>{venue.description}</p>
      <p>Price: ${venue.price}</p>
      <p>Max Guests: {venue.maxGuests}</p>
      <p>Rating: {venue.rating}</p>

      {venue.media && venue.media.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
            {venue.media.map((mediaItem, index) => (
            <img
                key={index}
                src={mediaItem.url}
                alt={mediaItem.alt || `Venue image ${index + 1}`}
                width="300"
                className="rounded shadow"
            />
            ))}
        </div>
        )}


      <h3>Manager:</h3>
      {venue.owner ? (
        <div>
          <p>
            Name:{' '}
            <Link to={`/profile/${venue.owner.name}`}>
              {venue.owner.name}
            </Link>
          </p>
          <p>Email: {venue.owner.email}</p>

          {venue.owner.avatar?.url && (
            <Link to={`/profile/${venue.owner.name}`}>
              <img
                src={venue.owner.avatar.url}
                alt={venue.owner.avatar.alt || 'Owner avatar'}
                width="100"
              />
            </Link>
          )}
        </div>
      ) : (
        <p>Unknown manager</p>
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

      <h3>Book this Venue:</h3>
      <Calendar
        selectRange={true}
        onChange={onChange}
        value={selectedDates}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
      />

      <h3>Guests:</h3>
      <input
        type="number"
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        min={1}
        max={venue.maxGuests}
        placeholder="Enter number of guests"
      />

      <button onClick={handleBooking}>Create Booking</button>

      {showBookingSuccess && <p>Booking Successful!</p>}
    </div>
  );
}

export default DetailVenues;
