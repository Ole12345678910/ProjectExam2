import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProfileWithDetails, updateProfile } from "../components/api";
import { FiEdit } from "react-icons/fi";

function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] overflow-y-auto bg-white rounded-md shadow-lg w-full max-w-xl p-6"
      >
        {children}
      </div>
    </div>
  );
}

function calculateDaysInclusive(dateFrom, dateTo) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((to - from) / msPerDay) + 1;
}


export default function DetailProfile() {
  const { profileName } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [venueManager, setVenueMgr] = useState(false);

  // overlay control
  const [overlayOpen, setOverlayOpen] = useState(false);

  /* fetch profile */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getProfileWithDetails(profileName, token);

        setProfile(data);
        setBio(data.bio);
        setAvatarUrl(data.avatar?.url || "");
        setBannerUrl(data.banner?.url || "");
        setVenueMgr(Boolean(data.venueManager));
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [profileName]);

  /* submit profile updates */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updated = {
      bio,
      avatar: { url: avatarUrl, alt: "Profile Avatar" },
      banner: { url: bannerUrl, alt: "Profile Banner" },
      venueManager,
    };

    try {
      await updateProfile(profileName, updated);

      // sync localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.venueManager = venueManager;
      localStorage.setItem("user", JSON.stringify(userData));


      setProfile((prev) => ({
        ...prev,
        ...updated,
      }));

      setOverlayOpen(false);

    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  /* ───────── render ───────── */
  if (loading) return <p>Loading…</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      {/* banner + avatar + pencil */}
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
            className="
              absolute left-1/2 -translate-x-1/2
              bottom-0 translate-y-1/2
              w-32 h-32 rounded-full object-cover
              ring-4 ring-yellowMain
            "
          />
        )}

        {/* bottom-left pencil */}
        <button
          onClick={() => setOverlayOpen(true)}
          aria-label="Edit profile"
          className="absolute left-1/2  -translate-x-[85px] bottom-0 translate-y-[190%] p-2"
        >
          <FiEdit className="h-7 w-7" />
        </button>
      </div>

      {/* profile body */}
      <div className="pt-20 flex flex-col items-center mb-6">
        <h3 className="text-xl mt-2">{profile.name}</h3>
        <p className="text-gray-600 mb-2">{profile.email}</p>

        {profile.venueManager && (
          <p className="mb-4 font-semibold">Venue Manager</p>
        )}

        <div className="bg-greySecond w-full p-3 rounded-xl shadow-md max-w-5xl mx-auto mb-6">
          <p>Bio:</p>
          <p className="mb-4 whitespace-pre-wrap">{profile.bio}</p>
        </div>

        {profile.venueManager && (
          <button
            onClick={() => navigate("/dashboard")}
            className="standard-button"
          >
            Go to Dashboard
          </button>
        )}
      </div>

      {/* bookings list */}
      <ul className="space-y-6 max-w-3xl mx-auto mb-6">
        <p>Your Bookings</p>
        {profile.bookings.map((b) => {
          const venue = b.venue;
          const mainImage = venue?.media?.[0];
          const days = calculateDaysInclusive(b.dateFrom, b.dateTo);
          const totalPrice = venue ? venue.price * days : "N/A";

          return (
            <li
              key={b.id}
              className="border rounded shadow hover:shadow-lg transition"
            >
              <Link
                to={`/venues/${venue?.id}`}
                className="block no-underline text-inherit"
              >
                {/* top banner image */}
                {mainImage && (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt || "Venue image"}
                    className="w-full h-20 sm:h-20 object-cover rounded-t"
                  />
                )}

                {/* booking details */}
                <div className="p-4 flex flex-col gap-1">
                  {/* first line — name left, dates right */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold flex-1 min-w-0 truncate">
                      {venue?.name || "Venue"}
                    </span>
                    <span className="auth-button">
                      From&nbsp;{new Date(b.dateFrom).toLocaleDateString()} –
                      To&nbsp;{new Date(b.dateTo).toLocaleDateString()}
                    </span>
                  </div>
                  {/* second line */}
                  <span>Days booked: {days}</span>
                  <span>Total Price: ${totalPrice}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ------------- EDIT OVERLAY ------------- */}
      {overlayOpen && (
        <Modal onClose={() => setOverlayOpen(false)}>
          <h2 className="text-xl mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-styling"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Avatar URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="input-styling"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Banner URL</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="input-styling "
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={venueManager}
                onChange={(e) => setVenueMgr(e.target.checked)}
              />
              Venue Manager
            </label>

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
