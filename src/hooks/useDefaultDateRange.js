
import { useEffect } from "react";
import { addDays, normalizeDate } from "../utils/dateUtils";

export function useDefaultDateRange({
  venue,
  otherBookings,
  selectedDates,
  autoSelectDates,
  setSelectedDates,
}) {
  useEffect(() => {
    if (!venue || selectedDates.length > 0 || !autoSelectDates) return;

    const today = new Date();
    const maxLookahead = 730;

    for (let i = 0; i < maxLookahead; i++) {
      const start = normalizeDate(addDays(today, i));
      const end = normalizeDate(addDays(start, 1));

      const isOverlapping = otherBookings.some((d) => {
        const normalizedD = normalizeDate(new Date(d));
        return normalizedD >= start && normalizedD <= end;
      });

      if (!isOverlapping) {
        setSelectedDates([start, end]);
        break;
      }
    }
  }, [venue, otherBookings, selectedDates, autoSelectDates, setSelectedDates]);
}
