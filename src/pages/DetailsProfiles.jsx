import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileWithDetails, updateProfile } from "../components/api"; 
import { Link } from "react-router-dom";

const DetailProfile = () => {
  const { profileName } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState(""); // State for bio input
  const [avatarUrl, setAvatarUrl] = useState(""); // State for avatar URL
  const [bannerUrl, setBannerUrl] = useState(""); // State for banner URL
  const [venueManager, setVenueManager] = useState(false); // State for venue manager
  const [isEditing, setIsEditing] = useState(false); // State to toggle form visibility

  const navigate = useNavigate(); 

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getProfileWithDetails(profileName, token);
      console.log("Profile Data:", data);
      setProfile(data);
      setBio(data.bio);
      setAvatarUrl(data.avatar?.url || "");
      setBannerUrl(data.banner?.url || "");
      setVenueManager(data.venueManager);
    } catch (error) {
      console.error("Error fetching profile:", error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [profileName]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    const updatedData = {
      bio,
      avatar: { url: avatarUrl, alt: "Profile Avatar" },
      banner: { url: bannerUrl, alt: "Profile Banner" },
      venueManager,
    };

    try {

      await updateProfile(profileName, updatedData);


      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        userData.venueManager = venueManager; 
        localStorage.setItem("user", JSON.stringify(userData)); 
      }

      setIsEditing(false); 
      navigate(`/profile/${profileName}`); 
    } catch (error) {
      console.error("Error updating profile:", error); 
    }
  };

  if (loading) {
    return <p>Loading...</p>;
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
              alt={profile.avatar.alt || "Avatar"}
              style={{ width: "150px", height: "auto", borderRadius: "50%" }}
            />
          </div>
        )}

        {profile.banner && profile.banner.url && (
          <div className="my-4">
            <img
              src={profile.banner.url}
              alt={profile.banner.alt || "Banner"}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        )}

        <p>Venue Manager: {profile.venueManager ? "Yes" : "No"}</p>
        <p>Venues: {profile._count.venues}</p>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Conditionally render the form when isEditing is true */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="my-4">
          <div className="mb-4">
            <label className="block mb-2" htmlFor="bio">
              Bio:
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="avatarUrl">
              Avatar URL:
            </label>
            <input
              type="text"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="bannerUrl">
              Banner URL:
            </label>
            <input
              type="text"
              id="bannerUrl"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={venueManager}
                onChange={(e) => setVenueManager(e.target.checked)}
                className="mr-2"
              />
              Venue Manager
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Bookings List */}
      {profile.bookings.map((booking) => (
        <li key={booking.id} className="border p-4 rounded shadow">
          <p>
            <strong>Venue:</strong>{" "}
            {booking.venue ? (
              <Link
                to={`/venues/${booking.venue.id}`}
                className="text-blue-500 hover:underline"
              >
                {booking.venue.name}
              </Link>
            ) : (
              "Unknown"
            )}
          </p>
          <p>
            <strong>Guests:</strong> {booking.guests}
          </p>
          <p>
            <strong>From:</strong>{" "}
            {new Date(booking.dateFrom).toLocaleDateString()}
          </p>
          <p>
            <strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}
          </p>
        </li>
      ))}
    </div>
  );
};

export default DetailProfile;
