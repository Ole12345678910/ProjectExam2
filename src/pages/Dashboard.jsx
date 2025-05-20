import { useState, useEffect } from "react";
import { PiChartBar } from "react-icons/pi";

import Venues from "./Venues";
import VenueForm from "../components/VenueForm";

import { useProfile } from "../hooks/useProfile";
import {
  emptyVenueForm,
  normalizeVenueData,
  buildVenuePayload,
} from "../utils/venueHelpers";
import { createVenue, deleteVenue, updateVenue } from "../components/api";

/* simple overlay with scrollable body */
function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] overflow-y-auto bg-white rounded-md"
      >
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  /* auth / profile */
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.name;

  const { profile, venues, error, refresh, setVenues } = useProfile(
    token,
    username
  );

  /* local state */
  const [formData, setFormData] = useState(emptyVenueForm); // for create
  const [editFormData, setEditFormData] = useState(emptyVenueForm); // for edit
  const [editVenueId, setEditVenueId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false); // NEW
  const [submitMsg, setSubmitMsg] = useState("");

  /* live clock */
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  /* helper that formats in desired TZ */
  const formatDateTime = (date) =>
    date.toLocaleString("en-GB", {
      // pick the locale you like
      timeZone: "Europe/Oslo", // ← change to the zone you want
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  /* lock background scroll when any modal open */
  useEffect(() => {
    const open = editVenueId || createOpen;
    document.body.classList.toggle("overflow-hidden", Boolean(open));
  }, [editVenueId, createOpen]);

  /* helpers */
  const handleEdit = (venue) => {
    setEditVenueId(venue.id);
    setEditFormData(normalizeVenueData(venue));
  };

  const handleSubmit = async (e, action, id) => {
    e.preventDefault();
    const data = action === "create" ? formData : editFormData;
    const payload = buildVenuePayload(data);

    try {
      if (action === "create") {
        const newVenue = await createVenue(payload, token);
        setVenues((prev) => [...prev, newVenue]);
        setFormData(emptyVenueForm);
        setCreateOpen(false);
        setSubmitMsg("✅ Created!");
      } else {
        await updateVenue(id, payload, token);
        await refresh();
        setEditVenueId(null);
        setSubmitMsg("✅ Updated!");
      }
    } catch (err) {
      setSubmitMsg("❌ " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete venue?")) return;
    try {
      await deleteVenue(id, token);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  /* render */
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="">
      {/* greeting / clock */}
      <div className="mt-6">
        <div className="max-w-7xl mx-auto">
          <p className="ml-6 flex items-center gap-2 font-Montserrat text-3xl">
            Hi, {profile.name} <PiChartBar />
          </p>
          <p className="ml-6">{formatDateTime(now)}</p>
        </div>
        <div className="bg-greySecond h-2 mt-6" />
      </div>

      {submitMsg && <p>{submitMsg}</p>}

      {/* your venues */}
      <section  className="max-w-5xl mx-auto">
        <h2 className="ml-6 text-xl my-2">Your Venues</h2>
        {venues.length === 0 ? (
          <p>No venues yet</p>
        ) : (
          <Venues
            venuesProp={venues}
            isEditable
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      {/* button to open CREATE modal */}
      <section className="mt-6">
        <button onClick={() => setCreateOpen(true)} className="standard-button">
          Make a Venue
        </button>
      </section>

      {/* EDIT overlay */}
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

      {/* CREATE overlay */}
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
