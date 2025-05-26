import React from "react";

export default function VenueForm({
  formData,
  setFormData,
  handleSubmit,
  submitText = "Submit",
  showCancel = false,
  onCancel,
}) {
  // Handle input and checkbox changes, update form data state accordingly
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full max-w-md bg-greySecond p-6"
    >
      {/* ─── Simple text and number input fields ─── */}
      <label className="flex flex-col input-text">
        Venue Name:
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-styling"
        />
      </label>

      <label className="flex flex-col input-text">
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="input-styling"
        />
      </label>

      <label className="flex flex-col input-text">
        Price:
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          className="input-styling"
        />
      </label>

      <label className="flex flex-col input-text">
        Max Guests:
        <input
          name="maxGuests"
          type="number"
          value={formData.maxGuests}
          onChange={handleChange}
          required
          className="input-styling"
        />
      </label>

      <label className="flex flex-col input-text">
        Rating:
        <input
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          className="input-styling"
        />
      </label>

      {/* ─── Amenities checkboxes ─── */}
      <fieldset>
        <legend className="input-text mb-1">Amenities:</legend>
        {["wifi", "parking", "breakfast", "pets"].map((key) => (
          <label key={key} className="inline-flex items-center gap-1 mr-4">
            <input
              type="checkbox"
              name={key}
              checked={formData[key]}
              onChange={handleChange}
            />
            {/* Capitalize the first letter of the amenity */}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </fieldset>

      {/* ─── Location input fields ─── */}
      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="mb-1 input-text">Location:</legend>
        {[
          "address",
          "city",
          "zip",
          "country",
          "continent",
          ["lat", "Latitude"],
          ["lng", "Longitude"],
        ].map((f) => {
          // Handle array with custom label or single string
          const [name, label = name] = Array.isArray(f) ? f : [f, f];
          return (
            <label key={name} className="flex flex-col">
              {label}
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="input-styling"
              />
            </label>
          );
        })}
      </fieldset>

      {/* ─── Image URLs text area ─── */}
      <label className="flex flex-col input-text">
        Image URLs (space / newline separated):
        <textarea
          name="mediaText"
          value={formData.mediaText}
          onChange={handleChange}
          rows={3}
          className="input-styling"
        />
      </label>

      {/* ─── Submit and optional Cancel buttons ─── */}
      <div className="mt-2 flex gap-3">
        <button type="submit" className="btn-primary flex-1 standard-button">
          {submitText}
        </button>
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1 cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
