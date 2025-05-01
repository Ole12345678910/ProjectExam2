import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get dynamic params
import { getSingleProfile } from '../components/api'; // Import the function for getting single profile


const DetailProfile = () => {
  const { profileName } = useParams(); // Get the profile name from the URL
  const [profile, setProfile] = useState(null); // Store the profile data
  const [error, setError] = useState(null); // Store error messages
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch a single profile
  const fetchProfileDetails = async () => {
    try {
      const profileData = await getSingleProfile(profileName); // Fetch profile using the name
      setProfile(profileData.data); // Set profile data
    } catch {
      setError('Failed to fetch profile details'); // Set error if request fails
    } finally {
      setLoading(false); // Set loading to false after the fetch is done
    }
  };

  useEffect(() => {
    fetchProfileDetails(); // Fetch profile details on initial load
  }, [profileName]); // Re-fetch if the profileName changes

  if (loading) {
    return <p>Loading...</p>; // Show loading while fetching data
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Show error if any
  }

  if (!profile) {
    return <p>Profile not found</p>; // If no profile is found
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
        <p>Bookings: {profile._count.bookings}</p>
      </div>
    </div>
  );
};

export default DetailProfile;
