import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProfile, updateProfile } from "../../components/api";
import { FiEdit } from "react-icons/fi";
import { daysBetween } from "../../utils/dateUtils";

// Modal component to show the edit overlay
function Modal({ children, onClose }) {
  useEffect(() => {
    // Prevent page scroll when modal is open
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    // Fullscreen semi-transparent backdrop, clicking outside closes modal
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      {/* Content box stops click events from bubbling to backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] overflow-y-auto bg-white rounded-md shadow-lg w-full max-w-xl p-6"
      >
        {children}
      </div>
    </div>
  );
}

export default function DetailProfile() {
  // Extract the profile name from the URL parameters
  const { profileName } = useParams();
  const navigate = useNavigate();

  // State variables for profile data and loading state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Separate states for editable fields
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [venueManager, setVenueMgr] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Fetch profile data on mount or when profileName changes
  useEffect(() => {
    (async () => {
      try {
        // Get token for authentication from localStorage
        const token = localStorage.getItem("token");
        // Fetch profile data from API
        const data = await getProfile(profileName, token);

        // Set state with received data, including form fields
        setProfile(data);
        setBio(data.bio);
        setAvatarUrl(data.avatar?.url || "");
        setBannerUrl(data.banner?.url || "");
        setVenueMgr(Boolean(data.venueManager));
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false); // Finished loading whether success or error
      }
    })();
  }, [profileName]);

  // Handle submission of the profile edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create object with updated profile info to send to API
    const updated = {
      bio,
      avatar: { url: avatarUrl, alt: "Profile Avatar" },
      banner: { url: bannerUrl, alt: "Profile Banner" },
      venueManager,
    };

    try {
      // Send update request to API
      await updateProfile(profileName, updated);

      // Also update local user data in localStorage if needed
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.venueManager = venueManager;
      localStorage.setItem("user", JSON.stringify(userData));

      // Update profile state with the new data
      setProfile((prev) => ({
        ...prev,
        ...updated,
      }));

      // Close the edit overlay
      setOverlayOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Show loading text while fetching data
  if (loading) return <p>Loading…</p>;
  // Show message if profile was not found or failed to load
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      {/* Profile banner, avatar, and edit button */}
      <div className="relative w-full">
        {profile.banner?.url && (
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || "Banner"}
            className="w-full object-cover aspect-[5/1]"
          />
        )}

        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "Avatar"}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 logo-size rounded-full object-cover ring-4 ring-yellowMain"
          />
        )}

        {/* Button to open edit profile modal */}
        <button
          onClick={() => setOverlayOpen(true)}
          aria-label="Edit profile"
          className="absolute left-1/2 -translate-x-[85px] bottom-0 translate-y-[190%] p-2"
        >
          <FiEdit className="h-7 w-7" />
        </button>
      </div>

      {/* Profile details */}
      <div className="pt-20 flex flex-col items-center mb-6">
        <h3 className="text-xl mt-2">{profile.name}</h3>
        <p className="text-gray-600 mb-2">{profile.email}</p>

        {/* Show Venue Manager status if applicable */}
        {profile.venueManager && (
          <p className="mb-4 font-semibold">Venue Manager</p>
        )}

        {/* Bio section */}
        <div className="bg-greySecond w-full p-3 rounded-xl shadow-md max-w-5xl mx-auto mb-6">
          <p>Bio:</p>
          <p className="mb-4 whitespace-pre-wrap">{profile.bio}</p>
        </div>

        {/* Button to navigate to dashboard if user is a venue manager */}
        {profile.venueManager && (
          <button
            onClick={() => navigate("/dashboard")}
            className="standard-button"
          >
            Go to Dashboard
          </button>
        )}
      </div>

      {/* List of user bookings */}
      <ul className="space-y-6 max-w-3xl mx-auto mb-6">
        <p>Your Bookings</p>
        {profile.bookings.map((b) => {
          const venue = b.venue;
          const mainImage = venue?.media?.[0];
          const days = daysBetween(b.dateFrom, b.dateTo);
          const totalPrice = venue ? venue.price * days : "N/A";

          return (
            <li
              key={b.id}
              className="border rounded shadow hover:shadow-lg transition"
            >
              {/* Link to venue details page */}
              <Link
                to={`/venues/${venue?.id}`}
                className="block no-underline text-inherit"
              >
                {mainImage && (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt || "Venue image"}
                    className="w-full h-20 sm:h-20 object-cover rounded-t"
                  />
                )}

                {/* Booking info */}
                <div className="p-4 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold flex-1 min-w-0 truncate">
                      {venue?.name || "Venue"}
                    </span>
                    <span className="auth-button">
                      From&nbsp;{new Date(b.dateFrom).toLocaleDateString()} –
                      To&nbsp;{new Date(b.dateTo).toLocaleDateString()}
                    </span>
                  </div>
                  <span>Days booked: {days}</span>
                  <span>Total Price: ${totalPrice}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Edit Profile Modal Overlay */}
      {overlayOpen && (
        <Modal onClose={() => setOverlayOpen(false)}>
          <h2 className="text-xl mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bio input */}
            <div>
              <label className="block mb-1 font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-styling"
              />
            </div>

            {/* Avatar URL input */}
            <div>
              <label className="block mb-1 font-medium">Avatar URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="input-styling"
              />
            </div>

            {/* Banner URL input */}
            <div>
              <label className="block mb-1 font-medium">Banner URL</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="input-styling"
              />
            </div>

            {/* Venue Manager checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={venueManager}
                onChange={(e) => setVenueMgr(e.target.checked)}
              />
              Venue Manager
            </label>

            {/* Form buttons */}
            <div className="flex gap-4">
              <button type="submit" className="standard-button">
                Save
              </button>
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
