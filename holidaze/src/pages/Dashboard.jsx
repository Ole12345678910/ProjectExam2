import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { emptyVenueForm, normalizeVenueData, buildVenuePayload } from "../utils/venueHelpers";
import { createVenue, deleteVenue, updateVenue } from "../components/api";
import VenueForm from "../components/VenueForm";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name;

  const { profile, venues, bookings, error, refresh, setVenues } = useProfile(token, username);

  const [formData, setFormData] = useState(emptyVenueForm);
  const [editFormData, setEditFormData] = useState(emptyVenueForm);
  const [editVenueId, setEditVenueId] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleSubmit(e, action, id) {
    e.preventDefault();
    const data = action === "create" ? formData : editFormData;
    const payload = buildVenuePayload(data);

    try {
      if (action === "create") {
        const newVenue = await createVenue(payload, token);
        setVenues((prev) => [...prev, newVenue]);
        setFormData(emptyVenueForm);
        setSubmitMessage("✅ Created!");
      } else {
        await updateVenue(id, payload, token);
        await refresh();
        setEditVenueId(null);
        setSubmitMessage("✅ Updated!");
      }
    } catch (err) {
      setSubmitMessage("❌ " + err.message);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Delete venue?")) {
      try {
        await deleteVenue(id, token);
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  }

  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      {submitMessage && <p>{submitMessage}</p>}

      <section>
        <h2>Create Venue</h2>
        <VenueForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={(e) => handleSubmit(e, "create")}
          submitText="Create"
        />
      </section>

      <section>
        <h2>Your Venues</h2>
        {venues.length === 0 ? (
          <p>No venues yet</p>
        ) : (
          <ul>
            {venues.map((venue) => (
              <li key={venue.id}>
                <Link to={`/venues/${venue.id}`}>{venue.name}</Link>
                <p>Guests: {venue.maxGuests}</p>
                {venue.media?.[0] && (
                  <img src={venue.media[0].url} alt={venue.media[0].alt} width="250" />
                )}
                <button onClick={() => handleDelete(venue.id)}>Delete</button>
                <button
                  onClick={() => {
                    setEditVenueId(venue.id);
                    setEditFormData(normalizeVenueData(venue));
                  }}
                >
                  Edit
                </button>
                {editVenueId === venue.id && (
                  <VenueForm
                    formData={editFormData}
                    setFormData={setEditFormData}
                    handleSubmit={(e) => handleSubmit(e, "update", venue.id)}
                    submitText="Update"
                    showCancel
                    onCancel={() => setEditVenueId(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
