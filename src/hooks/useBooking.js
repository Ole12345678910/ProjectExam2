import { useState } from "react";
import { createBooking, updateBooking, deleteBooking } from "../components/api";

export function useBooking({
  venueId,
  myBookings,
  otherBookings,
  onBookingsChange,
}) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [guests, setGuests] = useState(1);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  function resetForm() {
    setSelectedDates([]);
    setGuests(1);
    setEditingBooking(null);
  }

  function validateDateRange(range) {
    const [start, end] = range;


    const overlapsOthers = otherBookings.some(
      (date) => date >= start && date <= end
    );
    if (overlapsOthers) {
      alert("This date range overlaps with another user's booking.");
      return false;
    }


    const overlapsMine = myBookings.some(({ booking, dates }) => {
      if (editingBooking && booking.id === editingBooking.id) return false;
      return dates.some((date) => date >= start && date <= end);
    });

    if (overlapsMine) {
      alert("This date range overlaps with one of your bookings.");
      return false;
    }

    return true;
  }

  async function handleBooking() {
    if (selectedDates.length !== 2 || guests < 1) {
      alert("Please select valid dates and at least 1 guest.");
      return;
    }

    const [dateFrom, dateTo] = selectedDates;


    if (!validateDateRange([dateFrom, dateTo])) {
      return;
    }

    try {
      if (editingBooking) {
        await updateBooking(editingBooking.id, {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
        });
        alert("Booking updated!");
      } else {
        await createBooking({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId,
        });
        setShowBookingSuccess(true);
      }


      if (typeof onBookingsChange === "function") {
        await onBookingsChange();
      }

      resetForm();
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  }

  async function handleDeleteBooking(bookingId) {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        alert("Booking deleted.");

        if (typeof onBookingsChange === "function") {
          await onBookingsChange();
        }

        if (editingBooking?.id === bookingId) resetForm();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  }

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
