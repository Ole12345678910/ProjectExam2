import { useState } from "react";
import { createBooking, updateBooking, deleteBooking } from "../components/api";

// Custom hook to manage booking logic for a venue
export function useBooking({
  venueId,
  myBookings,
  otherBookings,
  onBookingsChange,
}) {
  // State to track the selected date range (start and end dates)
  const [selectedDates, setSelectedDates] = useState([]);
  // State for number of guests (default to 1)
  const [guests, setGuests] = useState(1);
  // State to hold the booking currently being edited (if any)
  const [editingBooking, setEditingBooking] = useState(null);
  // State to show a success message after booking
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Reset the form fields to default values
  function resetForm() {
    setSelectedDates([]);
    setGuests(1);
    setEditingBooking(null);
  }

  // Validate if the selected date range overlaps with other bookings
  function validateDateRange(range) {
    const [start, end] = range;

    // Check if the date range overlaps with other users' bookings
    const overlapsOthers = otherBookings.some(
      (date) => date >= start && date <= end
    );
    if (overlapsOthers) {
      alert("This date range overlaps with another user's booking.");
      return false;
    }

    // Check if the date range overlaps with the user's own bookings,
    // ignoring the booking currently being edited
    const overlapsMine = myBookings.some(({ booking, dates }) => {
      if (editingBooking && booking.id === editingBooking.id) return false;
      return dates.some((date) => date >= start && date <= end);
    });

    if (overlapsMine) {
      alert("This date range overlaps with one of your bookings.");
      return false;
    }

    // Return true if no overlaps found
    return true;
  }

  // Handle creating or updating a booking
  async function handleBooking() {
    // Check if selectedDates has exactly two dates and guests is at least 1
    if (selectedDates.length !== 2 || guests < 1) {
      alert("Please select valid dates and at least 1 guest.");
      return;
    }

    const [dateFrom, dateTo] = selectedDates;

    // Validate the date range for conflicts
    if (!validateDateRange([dateFrom, dateTo])) {
      return;
    }

    try {
      if (editingBooking) {
        // Update an existing booking
        await updateBooking(editingBooking.id, {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
        });
        alert("Booking updated!");
      } else {
        // Create a new booking
        await createBooking({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId,
        });
        setShowBookingSuccess(true);
      }

      // Call external callback to refresh bookings after changes
      if (typeof onBookingsChange === "function") {
        await onBookingsChange();
      }

      // Reset the form after booking
      resetForm();
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  }

  // Handle deleting a booking by its ID
  async function handleDeleteBooking(bookingId) {
    // Confirm with the user before deleting
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        alert("Booking deleted.");

        // Refresh bookings after deletion
        if (typeof onBookingsChange === "function") {
          await onBookingsChange();
        }

        // If the deleted booking was being edited, reset the form
        if (editingBooking?.id === bookingId) resetForm();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  }

  // Return state and handler functions for use in components
  return {
    selectedDates,
    setSelectedDates,
    guests,
    setGuests,
    editingBooking,
    setEditingBooking,
    showBookingSuccess,
    setShowBookingSuccess,
    resetForm,
    validateDateRange,
    handleBooking,
    handleDeleteBooking,
  };
}
