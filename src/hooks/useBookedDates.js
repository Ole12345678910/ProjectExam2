import { useMemo } from "react";
import { getDatesBetween } from "../utils/dateUtils";

// Custom hook to separate the booked dates for a venue between the current user and others
export function useBookedDates(venue, user) {
  return useMemo(() => {
    // Array to hold bookings that belong to the current user
    const mine = [];
    // Array to hold dates booked by other users
    const others = [];

    // Loop through each booking of the venue (if any)
    venue?.bookings.forEach((booking) => {
      // Get all dates between the booking start and end dates
      const dates = getDatesBetween(
        new Date(booking.dateFrom),
        new Date(booking.dateTo)
      );

      // Check if this booking belongs to the current user by comparing names
      if (booking.customer?.name === user?.name) {
        // Store booking and its dates in 'mine' array
        mine.push({ booking, dates });
      } else {
        // For other users, add all booked dates to the 'others' array
        others.push(...dates);
      }
    });

    // Return an object containing:
    // - all bookings by the current user with their dates
    // - all dates booked by others (flattened array)
    // - all dates booked by the current user (flattened from their bookings)
    return {
      myBookings: mine,
      otherBookings: others,
      allMyBookingDates: mine.flatMap((b) => b.dates),
    };
  }, [venue, user]); // Recompute only when venue or user changes
}
