import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { getProfileWithDetails } from '../components/api'; 
import { Link } from 'react-router-dom';


const DetailProfile = () => {
  const { profileName } = useParams(); 
  const [profile, setProfile] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 


  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const data = await getProfileWithDetails(profileName, token);
      setProfile(data);
    } catch (err) {
      setError("Failed to fetch profile details");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProfileDetails(); 
  }, [profileName]); 

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; 
  }

  if (!profile) {
    return <p>Profile not found</p>; 
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Details</h2>

      <div className="border p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
        <p>Email: {profile.email}</p>
        <p>Bio: {profile.bio}</p>

        {profile.avatar && (
          <div className="my-4">
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt || 'Avatar'}
              style={{ width: '150px', height: 'auto', borderRadius: '50%' }}
            />
          </div>
        )}

        {profile.banner && profile.banner.url && (
          <div className="my-4">
            <img
              src={profile.banner.url}
              alt={profile.banner.alt || 'Banner'}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        )}

        <p>Venue Manager: {profile.venueManager ? 'Yes' : 'No'}</p>
        <p>Venues: {profile._count.venues}</p>
      </div>
      {profile.bookings && profile.bookings.length > 0 ? (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Bookings</h3>
            <ul className="space-y-4">
            {profile.bookings.map((booking) => (
                <li key={booking.id} className="border p-4 rounded shadow">
                <p>
                    <strong>Venue:</strong>{' '}
                    {booking.venue ? (
                    <Link
                        to={`/venues/${booking.venue.id}`}
                        className="text-blue-500 hover:underline"
                    >
                        {booking.venue.name}
                    </Link>
                    ) : (
                    'Unknown'
                    )}
                </p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
                <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
                </li>
            ))}
            </ul>

        </div>
        ) : (
        <p className="mt-4">No bookings found.</p>
        )}

    </div>
  );
};

export default DetailProfile;
