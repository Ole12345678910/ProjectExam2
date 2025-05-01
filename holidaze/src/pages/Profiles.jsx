import { useEffect, useState } from 'react';
import { getAllProfiles, searchProfiles } from '../components/api';
import { Link } from 'react-router-dom';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]); // Store profiles
  const [searchQuery, setSearchQuery] = useState(''); // Store search query
  const [error, setError] = useState(''); // Store error message
  const [loading, setLoading] = useState(false); // Store loading state

  // Function to fetch profiles based on search query
  const fetchProfiles = async (query = '') => {
    setLoading(true); // Start loading before fetching
    try {
      const response = query
        ? await searchProfiles(query) // Call the search endpoint
        : await getAllProfiles(); // Call all profiles if no query
      console.log(response.data); // For debugging purposes
      setProfiles(response.data); // Set profiles data
    } catch (err) {
      setError(err.message); // Set error if something goes wrong
    } finally {
      setLoading(false); // End loading after fetch
    }
  };

  useEffect(() => {
    fetchProfiles(); // Fetch all profiles on initial load
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query
    fetchProfiles(e.target.value); // Fetch profiles based on the query
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profiles</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border rounded-md"
        />
      </div>

      {/* Loading message */}
      {loading && <p>Loading...</p>}

      {/* No profiles found message */}
      {!loading && profiles.length === 0 && searchQuery && (
        <p>No profiles found for "{searchQuery}". Try another query.</p>
      )}

      {/* Profiles listing */}
      <div className="space-y-8">
        {profiles.map((profile, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio}</p>

            {profile.avatar && (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt || 'Avatar'}
                style={{ width: '150px', height: 'auto', borderRadius: '50%' }}
                className="my-4"
              />
            )}

            {profile.banner && profile.banner.url && (
              <img
                src={profile.banner.url}
                alt={profile.banner.alt || 'Banner'}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                className="my-4"
              />
            )}

            <p>Venue Manager: {profile.venueManager ? 'Yes' : 'No'}</p>
            <p>Venues: {profile._count.venues}</p>
            <p>Bookings: {profile._count.bookings}</p>

            <Link to={`/profile/${profile.name}`} className="text-blue-600 hover:underline">
              View Profile Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
