import { useEffect, useState } from 'react';
import { getAllVenues } from '../components/api';
import { Link } from 'react-router-dom';

const Venues = () => {
  const [venues, setVenues] = useState([]); 
  const [error, setError] = useState('');

  useEffect(() => {
    getAllVenues()
      .then(data => {
        console.log(data.data); 
        setVenues(data.data);
      })
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Venues</h2>
      {error && <p>{error}</p>}
      <ul>
        {venues.map(v => (
          <li key={v.id}>
            <Link to={`/venues/${v.id}`} className="hover:underline">
              {v.name}
            </Link>

            <p>Price: ${v.price}</p>
            {v.media.length > 0 && (
              <img
                src={v.media[0].url}
                alt={v.media[0].alt}
                style={{ width: '300px', height: 'auto' }}
              />
            )}
            <p>Max Guests: {v.maxGuests}</p>

            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Venues;
