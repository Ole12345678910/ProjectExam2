import { useState, useEffect } from "react";
import { PiChartBar } from "react-icons/pi";

import Venues from "../venue/Venues";
import VenueForm from "../../components/VenueForm";
import VenueBookings from "../../components/userBookings";
import { useProfile } from "../../hooks/useProfile";
import {
  emptyVenueForm,
  normalizeVenueData,
  buildVenuePayload,
} from "../../utils/venueHelpers";
import { createVenue, deleteVenue, updateVenue } from "../../components/api";
import { VenueWithBookings } from "../../components/VenueWithBookings";

/* Simple modal overlay with a scrollable body */
function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose} // Clicking outside modal content closes the modal
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside content
        className="max-h-[90vh] overflow-y-auto bg-white rounded-md"
      >
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  /* Get auth token and user info from localStorage */
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.name;

  /* Custom hook to fetch profile, venues, error, and refresh function */
  const { profile, venues, error, refresh, setVenues } = useProfile(
    token,
    username
  );

  /* Local state for form data, editing venue, modals and messages */
  const [formData, setFormData] = useState(emptyVenueForm); // For creating new venue
  const [editFormData, setEditFormData] = useState(emptyVenueForm); // For editing venue
  const [editVenueId, setEditVenueId] = useState(null); // Which venue is being edited
  const [createOpen, setCreateOpen] = useState(false); // Is create modal open
  const [submitMsg, setSubmitMsg] = useState(""); // Message after submit (success or error)

  /* Live clock state that updates every second */
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* Format date/time nicely for display */
  const formatDateTime = (date) =>
    date.toLocaleString("en-GB", {
      timeZone: "Europe/Oslo",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  /* Disable background scroll when modal is open */
  useEffect(() => {
    const open = editVenueId || createOpen;
    document.body.classList.toggle("overflow-hidden", Boolean(open));
  }, [editVenueId, createOpen]);

  /* Called when clicking "Edit" on a venue */
  const handleEdit = (venue) => {
    setEditVenueId(venue.id);
    setEditFormData(normalizeVenueData(venue)); // Prepare data for editing form
  };

  /* Handle form submission for create or update actions */
  const handleSubmit = async (e, action, id) => {
    e.preventDefault();
    const data = action === "create" ? formData : editFormData;
    const payload = buildVenuePayload(data); // Prepare data in API format

    try {
      if (action === "create") {
        await createVenue(payload, token);
        await refresh(); // Refresh venues after creation
        setFormData(emptyVenueForm); // Reset form
        setCreateOpen(false); // Close create modal
        setSubmitMsg("✅ Created!");
      } else {
        await updateVenue(id, payload, token);
        await refresh(); // Refresh venues after update
        setEditVenueId(null); // Close edit modal
        setSubmitMsg("✅ Updated!");
      }
    } catch (err) {
      setSubmitMsg("❌ " + err.message); // Show error message
    }
  };

  /* Handle deleting a venue */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete venue?")) return; // Confirm with user first
    try {
      await deleteVenue(id, token);
      // Update venues locally without refetching
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  /* Show error if profile fetch failed */
  if (error) return <p>Error: {error}</p>;
  /* Show loading while profile is not loaded */
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="">
      {/* Greeting and live clock */}
      <div className="mt-6">
        <div className="max-w-7xl mx-auto">
          <p className="ml-6 flex items-center gap-2 font-Montserrat text-3xl">
            Hi, {profile.name} <PiChartBar />
          </p>
          <p className="ml-6">{formatDateTime(now)}</p>
        </div>
        <div className="bg-greySecond h-2 mt-6" />
      </div>

      {/* Show submission message */}
      {submitMsg && <p>{submitMsg}</p>}

      {/* User's venues header */}
      <h2 className="ml-6 text-xl my-2">Your Venues</h2>
      <div className="flex justify-between items-center max-w-5xl mx-auto mt-4 px-4">
        {/* Button to open create modal */}
        <button
          onClick={() => setCreateOpen(true)}
          className="standard-button"
        >
          Create Venue
        </button>
      </div>

      {/* Venue list or message if none */}
      <section className="max-w-5xl mx-auto py-8 flex justify-center">
        {venues.length === 0 ? (
          <p>No venues yet</p>
        ) : (
          <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <VenueWithBookings
                key={venue.id}
                venue={venue}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Edit modal */}
      {editVenueId && (
        <Modal onClose={() => setEditVenueId(null)}>
          <VenueForm
            formData={editFormData}
            setFormData={setEditFormData}
            handleSubmit={(e) => handleSubmit(e, "update", editVenueId)}
            submitText="Update"
            showCancel
            onCancel={() => setEditVenueId(null)}
          />
        </Modal>
      )}

      {/* Create modal */}
      {createOpen && (
        <Modal onClose={() => setCreateOpen(false)}>
          <VenueForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={(e) => handleSubmit(e, "create")}
            submitText="Create"
            showCancel
            onCancel={() => setCreateOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
