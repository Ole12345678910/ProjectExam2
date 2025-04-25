import { useEffect, useState } from 'react';
import { getAllBookings, createBooking, updateBooking, deleteBooking } from './components/api.js';

console.log(updateBooking);

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllBookings()
      .then(data => setBookings(data.data))
      .catch(err => setError(err.message));
  }, []);

  // Example: creating a booking
  const handleCreate = async () => {
    const newBooking = {
      dateFrom: new Date().toISOString(),
      dateTo: new Date(Date.now() + 86400000).toISOString(),
      guests: 2,
      venueId: 'some-venue-id',
    };
    try {
      const result = await createBooking(newBooking);
      setBookings([...bookings, result.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p>{error}</p>}
      <button onClick={handleCreate}>Create Booking</button>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            {b.dateFrom} - {b.dateTo}
            <button onClick={() => deleteBooking(b.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
