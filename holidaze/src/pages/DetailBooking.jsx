import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllBookings } from '../components/api';

function DetailBooking() {
  const { id } = useParams(); 
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBooking() {
        try {
          const allBookings = await getAllBookings();
          console.log('Alle bookinger:', allBookings.data); 
          
          const foundBooking = allBookings.data.find(b => b.id === id);
          console.log('Funnet booking:', foundBooking); 
          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            setError('Booking not found');
          }
        } catch (err) {
          setError(err.message);
        }
      }
      
    fetchBooking();
  }, [id]); 

  if (error) {
    return <p>{error}</p>;
  }

  if (!booking) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Booking Details</h1>
      <p>Date From: {booking.dateFrom}</p>
      <p>Date To: {booking.dateTo}</p>
      <p>Guests: {booking.guests}</p>
      {/* Du kan vise mer detaljer her */}
    </div>
  );
}

export default DetailBooking;
