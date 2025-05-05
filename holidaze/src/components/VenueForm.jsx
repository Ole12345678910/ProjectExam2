import React from "react";


export default function VenueForm({
  formData,
  setFormData,
  handleSubmit,
  submitText = "Submit",
  showCancel = false,
  onCancel,
}) {
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px" }}
    >
      <label>
        Venue Name:
        <input name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </label>

      <label>
        Price:
        <input name="price" type="number" value={formData.price} onChange={handleChange} required />
      </label>

      <label>
        Max Guests:
        <input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} required />
      </label>

      <label>
        Rating:
        <input name="rating" type="number" value={formData.rating} onChange={handleChange} />
      </label>

      <fieldset>
        <legend>Amenities</legend>
        <label>
          <input type="checkbox" name="wifi" checked={formData.wifi} onChange={handleChange} />
          WiFi
        </label>
        <label>
          <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} />
          Parking
        </label>
        <label>
          <input type="checkbox" name="breakfast" checked={formData.breakfast} onChange={handleChange} />
          Breakfast
        </label>
        <label>
          <input type="checkbox" name="pets" checked={formData.pets} onChange={handleChange} />
          Pets
        </label>
      </fieldset>

      <fieldset>
        <legend>Location</legend>
        <label>
          Address:
          <input name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          City:
          <input name="city" value={formData.city} onChange={handleChange} />
        </label>
        <label>
          Zip:
          <input name="zip" value={formData.zip} onChange={handleChange} />
        </label>
        <label>
          Country:
          <input name="country" value={formData.country} onChange={handleChange} />
        </label>
        <label>
          Continent:
          <input name="continent" value={formData.continent} onChange={handleChange} />
        </label>
        <label>
          Latitude:
          <input name="lat" type="number" value={formData.lat} onChange={handleChange} />
        </label>
        <label>
          Longitude:
          <input name="lng" type="number" value={formData.lng} onChange={handleChange} />
        </label>
      </fieldset>

      <label>
        Image URLs (space/newline separated):
        <textarea
          name="mediaText"
          value={formData.mediaText}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <button type="submit">{submitText}</button>
      {showCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}
