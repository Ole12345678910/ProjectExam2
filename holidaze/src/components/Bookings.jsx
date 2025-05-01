import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllBookings, deleteBooking } from './api'; 

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllBookings()
      .then(data => {
        console.log(data.data); 
        setBookings(data.data);
      })
      .catch(err => setError(err.message));
  }, []);
  

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p>{error}</p>}
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            <Link to={`/details/${b.id}`} className="hover:underline">
              {b.dateFrom} - {b.dateTo}
            </Link>
            <button onClick={() => handleDelete(b.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
