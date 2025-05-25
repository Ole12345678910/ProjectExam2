import { useMemo } from "react";
import { getDatesBetween } from "../utils/dateUtils";

export function useBookedDates(venue, user) {
  return useMemo(() => {
    const mine = [];
    const others = [];

    venue?.bookings.forEach((booking) => {
      const dates = getDatesBetween(
        new Date(booking.dateFrom),
        new Date(booking.dateTo)
      );

      if (booking.customer?.name === user?.name) {
        mine.push({ booking, dates });
      } else {
        others.push(...dates);
      }
    });

    return {
      myBookings: mine,
      otherBookings: others,
      allMyBookingDates: mine.flatMap((b) => b.dates),
    };
  }, [venue, user]);
}
