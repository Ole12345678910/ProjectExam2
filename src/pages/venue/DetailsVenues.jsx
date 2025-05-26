import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import {
  rangesOverlap,
  normalizeDate,
  daysBetween,
} from "../../utils/dateUtils";

import { useDefaultDateRange } from "../../hooks/useDefaultDateRange";

import Calendar from "react-calendar";
import { FaStar } from "react-icons/fa";
import holizaeMark from "../../assets/holizaeMark.png";
import { useBooking } from "../../hooks/useBooking";
import { useVenue } from "../../hooks/useVenue";
import { useUser } from "../../hooks/useUser";
import { useBookedDates } from "../../hooks/useBookedDates";

function DetailVenues() {
  // Get the venue ID from the URL params (react-router)
  const { id } = useParams();

  // Custom hook to fetch venue data, error state, and function to reload venue
  const { venue, error, loadVenue } = useVenue(id);

  // State to control if dates should auto-select or not
  const [autoSelectDates, setAutoSelectDates] = useState(true);

  // Define date boundaries: min date is 5 years ago, max date 10 years in future
  const today = new Date();
  const currentYear = today.getFullYear();
  const minDate = new Date(currentYear - 5, 0, 1);
  const maxDate = new Date(currentYear + 10, 11, 31);

  // State for showing validation error messages about date selection
  const [errorMsg, setErrorMsg] = useState("");

  // Get current logged in user info
  const user = useUser();

  // Custom hook returning booked dates by user and others for the venue
  const { myBookings, otherBookings, allMyBookingDates } = useBookedDates(
    venue,
    user
  );

  // Custom hook to manage booking state and handlers
  const {
    selectedDates,
    setSelectedDates,
    guests,
    setGuests,
    editingBooking,
    setEditingBooking,
    handleBooking,
    handleDeleteBooking,
    showBookingSuccess,
    resetForm,
  } = useBooking({
    venueId: id,
    myBookings,
    otherBookings,
    onBookingsChange: loadVenue, // refresh venue bookings after changes
  });

  // Function to check if selected date range conflicts with other bookings
  const validateDateRange = (range) => {
    const [start, end] = range;

    // Check if the new range overlaps with bookings from other users
    const overlapsOthers = otherBookings.some((date) =>
      rangesOverlap(start, end, date, date)
    );

    if (overlapsOthers) {
      setErrorMsg("This date range is already booked by someone else.");
      return false;
    }

    // Check if new range overlaps with current user's other bookings (excluding currently edited)
    const overlapsMine = myBookings.some(({ booking }) => {
      if (editingBooking && booking.id === editingBooking.id) return false;
      return rangesOverlap(
        start,
        end,
        new Date(booking.dateFrom),
        new Date(booking.dateTo)
      );
    });

    if (overlapsMine) {
      setErrorMsg("You cant overlap your own bookings.");
      return false;
    }

    // Clear error if no conflicts
    setErrorMsg("");
    return true;
  };

  // Handler when user clicks a day on the calendar
  const handleDayClick = (date) => {
    // Disable auto date selection when user manually picks a date
    setAutoSelectDates(false);

    // Normalize date to consistent format (e.g., remove time)
    const normDate = normalizeDate(date);

    // If no dates or 2 dates selected, start new selection with clicked date
    if (selectedDates.length === 0 || selectedDates.length === 2) {
      setSelectedDates([normDate]);
      return;
    }

    // Otherwise, user is selecting the second date to create a range
    const start = normalizeDate(selectedDates[0]);
    // Determine correct order for start and end dates
    const end = normDate < start ? start : normDate;
    const range = [start < end ? start : end, start < end ? end : start];

    // Validate the selected range; set it if valid, else clear selection
    if (validateDateRange(range)) {
      setSelectedDates(range);
    } else {
      setSelectedDates([]);
    }
  };

  // On component mount, reset selected dates and enable autoSelectDates
  useEffect(() => {
    setSelectedDates([]);
    setAutoSelectDates(true);
  }, []);

  // Custom hook to auto select default date range when applicable
  useDefaultDateRange({
    venue,
    otherBookings,
    selectedDates,
    autoSelectDates,
    setSelectedDates,
  });

  // Function to add CSS class names to calendar tiles based on booking status
  const tileClassName = ({ date }) => {
    const normalizedDate = normalizeDate(date);
    
    // Check if date is part of user's own bookings
    const isMine = allMyBookingDates.some(
      (d) => normalizeDate(d).getTime() === normalizedDate.getTime()
    );
    
    // Check if date is booked by others
    const isOther = otherBookings.some(
      (d) => normalizeDate(d).getTime() === normalizedDate.getTime()
    );

    // Check if date is inside the user-selected range
    const [start, end] = selectedDates;
    const isInRange = start && end && date >= start && date <= end;
    
    // Check if date is the starting date of the selection
    const isStart =
      start && !end && date.toDateString() === start.toDateString();

    // Return appropriate class name for styling background colors
    if (isStart) return "highlighted-start";
    if (isInRange) return "highlighted-selected";
    if (isMine) return "highlighted-mine";
    if (isOther) return "highlighted-booked";

    // No special class for unbooked/unselected dates
    return "";
  };

  // Disable days on the calendar that are booked by others (or outside editable booking range)
  const tileDisabled = ({ date }) => {
    if (editingBooking) {
      // Allow editing dates inside the booking currently being edited
      const start = normalizeDate(new Date(editingBooking.dateFrom));
      const end = normalizeDate(new Date(editingBooking.dateTo));
      const normalizedDate = normalizeDate(date);
      if (normalizedDate >= start && normalizedDate <= end) return false;
    }

    // Disable dates booked by others
    const normalizedDate = normalizeDate(date);
    return otherBookings.some(
      (d) => normalizeDate(d).getTime() === normalizedDate.getTime()
    );
  };

  // Render loading or error states if necessary
  if (error) return <p>{error}</p>;
  if (!venue) return <p>Loading...</p>;

  // Normalize selected start and end dates for calculations
  const normalizedStart = selectedDates[0]
    ? normalizeDate(selectedDates[0])
    : null;
  const normalizedEnd = selectedDates[1]
    ? normalizeDate(selectedDates[1])
    : null;

  // Calculate total number of days selected
  const totalDays =
    normalizedStart && normalizedEnd
      ? daysBetween(normalizedStart, normalizedEnd)
      : selectedDates.length === 1
      ? 1
      : 0;

  // Calculate total price based on days selected and venue price
  const totalPrice = totalDays * venue.price;

  // (rest of the component continues...)



  return (
    <>
      <div className="vennueContainer">
        {venue.media?.length > 0 && (
          <div className="">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              useKeyboardArrows
              swipeable
              emulateTouch
              autoPlay
              interval={4000}
              showIndicators={venue.media.length > 1}
              stopOnHover
            >
              {venue.media.map((mediaItem, index) => (
                <div
                  key={index}
                  className="aspect-video w-full overflow-hidden rounded-lg"
                >
                  <img
                    src={mediaItem.url}
                    alt={mediaItem.alt || `Venue image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        <div className="flex mt-6">
          <div className="w-1/2">
            <h1 className="text-2xl font-bold break-words">{venue.name}</h1>
            <p className="text-greyStandard mb-2 break-words">
              {venue.description}
            </p>

            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(venue.rating)
                      ? "text-yellowMain"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-greyStandard">
                ({venue.rating})
              </span>
            </div>

            <p className="mt-2">Max Guests: {venue.maxGuests}</p>
            <p>Price: ${venue.price}</p>
          </div>

          <div className="w-1/2 flex justify-end items-start">
            <img src={holizaeMark} className="logo-size" alt="Holidaze logo" />
          </div>
        </div>

        {venue.owner && (
          <div className="venue-owner-bar">
            {venue.owner.avatar?.url && (
              <img
                src={venue.owner.avatar.url}
                alt={venue.owner.avatar.alt || "Owner avatar"}
                width="100"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <strong>
                <p>{venue.owner.name}</p>
              </strong>
              <p className="break-all">{venue.owner.email}</p>
            </div>
          </div>
        )}

        <div className="info-text">
          <strong>
            <p className="mt-4 text-lg">Location:</p>
          </strong>
          <p>
            {venue.location.address}, {venue.location.city},{" "}
            {venue.location.country}
          </p>
        </div>

        <div className="info-text">
          <strong>
            <p className="mt-4 text-lg">Facilities:</p>
          </strong>
          <ul className="list-disc pl-5">
            <li>Wifi: {venue.meta.wifi ? "Yes" : "No"}</li>
            <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
            <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
            <li>Pets: {venue.meta.pets ? "Yes" : "No"}</li>
          </ul>
        </div>

        {/* Calendar */}
        <div className="flex flex-col items-center">
          <div className="mx-auto max-w-3xl">
            <Calendar
              prev2Label={null}
              next2Label={null}
              minDate={minDate}
              maxDate={maxDate}
              selectRange={false}
              onClickDay={handleDayClick}
              value={selectedDates}
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
              showNeighboringDecade={false}
              showNeighboringMonth={false}
            />
          </div>
          {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

          {showBookingSuccess && (
            <p className="text-green-600 mt-2">Booking Successful!</p>
          )}

          {/*Bookings Edit and Delete */}
          <h3 className="mt-6 font-semibold">Your Bookings:</h3>
          {myBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul className="space-y-2">
              {myBookings.map(({ booking }) => {
                const isEditing = editingBooking?.id === booking.id;
                return (
                  <li
                    key={booking.id}
                    className={`flex p-2 rounded ${
                      isEditing ? "bg-yellow-50 ring-2 ring-yellow-400 " : ""
                    }`}
                  >
                    <div>
                      {normalizeDate(new Date(booking.dateFrom)).toDateString()}{" "}
                      – {normalizeDate(new Date(booking.dateTo)).toDateString()}{" "}
                      ({booking.guests} guests)
                      {isEditing && (
                        <span className="ml-2 text-xs font-semibold text-yellow-600">
                          editing…
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => {
                              setEditingBooking(booking);
                              setSelectedDates([
                                new Date(booking.dateFrom),
                                new Date(booking.dateTo),
                              ]);
                              setGuests(booking.guests);
                            }}
                            className="text-blue-600 underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {isEditing && (
                        <>
                          <button
                            onClick={handleBooking}
                            className="standard-button"
                          >
                            Save
                          </button>
                          <button onClick={resetForm} className="cancel-button">
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/*Clear choice */}
          <button
            onClick={resetForm}
            className="mt-4 bg-gray-300 px-4 py-2 rounded"
          >
            Clear Selection
          </button>
        </div>
      </div>
      {/* Sticky booking bar */}

      {selectedDates.length === 2 && (
        <div className="footer-book-bar">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p>
                Selected Dates: {selectedDates[0].toDateString()} -{" "}
                {selectedDates[1].toDateString()}
              </p>
              <p>Guests: {guests}</p>
              <p>
                Total Price: <strong>${totalPrice}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                max={venue.maxGuests}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
                className="border rounded px-2 py-1 w-20"
              />
              <button onClick={handleBooking} className="standard-button">
                {editingBooking ? "Update Booking" : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailVenues;
