import { useEffect } from "react";
import { addDays, normalizeDate } from "../utils/dateUtils";

// Custom hook to automatically set a default date range for booking
export function useDefaultDateRange({
  venue,
  otherBookings,
  selectedDates,
  autoSelectDates,
  setSelectedDates,
}) {
  useEffect(() => {
    // Only run if:
    // 1. Venue exists
    // 2. No dates are selected yet
    // 3. Auto-selection is enabled
    if (!venue || selectedDates.length > 0 || !autoSelectDates) return;

    const today = new Date();
    const maxLookahead = 730; // Max days to look ahead (about 2 years)

    // Loop from today up to maxLookahead days to find a free date range
    for (let i = 0; i < maxLookahead; i++) {
      // Calculate potential start and end dates for a booking (1-day range)
      const start = normalizeDate(addDays(today, i));
      const end = normalizeDate(addDays(start, 1));

      // Check if these dates overlap with any other bookings
      const isOverlapping = otherBookings.some((d) => {
        const normalizedD = normalizeDate(new Date(d));
        // Returns true if any booked date falls between start and end
        return normalizedD >= start && normalizedD <= end;
      });

      // If no overlap found, select this date range and stop searching
      if (!isOverlapping) {
        setSelectedDates([start, end]);
        break;
      }
    }
  }, [venue, otherBookings, selectedDates, autoSelectDates, setSelectedDates]);
}
