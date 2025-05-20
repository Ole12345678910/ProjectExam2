import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Carousel } from "react-responsive-carousel";
import Calendar from "react-calendar";
import {
  getVenueById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../components/api";
import { FaStar } from "react-icons/fa";
import holizaeMark from "../assets/holizaeMark.png";

function DetailVenues() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [guests, setGuests] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [autoSelectDates, setAutoSelectDates] = useState(true); // ✅ lagt til

  const today = new Date();
  const currentYear = today.getFullYear();
  const minDate = new Date(currentYear - 5, 0, 1);
  const maxDate = new Date(currentYear + 10, 11, 31);

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  const fetchVenueData = useCallback(async () => {
    try {
      const response = await getVenueById(id);
      setVenue(response.data);
    } catch (err) {
      setError("Error loading venue: " + err.message);
    }
  }, [id]);

  useEffect(() => {
    fetchVenueData();
  }, [fetchVenueData]);

  const { myBookings, otherBookings, allMyBookingDates } = useMemo(() => {
    const mine = [];
    const others = [];

    venue?.bookings.forEach((booking) => {
      const dates = [];
      let current = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

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

  const resetForm = () => {
    setSelectedDates([]);
    setGuests(1);
    setEditingBooking(null);
    setAutoSelectDates(false);
  };

  const validateDateRange = (range) => {
    const [start, end] = range;

    const overlapsOthers = otherBookings.some((d) => d >= start && d <= end);
    if (overlapsOthers) {
      alert("This date range overlaps with another user's booking.");
      return false;
    }

    const overlapsMine = myBookings.some(({ booking, dates }) => {
      if (editingBooking && booking.id === editingBooking.id) return false;
      return dates.some((d) => d >= start && d <= end);
    });

    if (overlapsMine) {
      alert("This date range overlaps with one of your bookings.");
      return false;
    }

    return true;
  };

  const handleDayClick = (date) => {
    setAutoSelectDates(false);

    if (selectedDates.length === 0 || selectedDates.length === 2) {
      setSelectedDates([date]);
      return;
    }

    const start = selectedDates[0];
    const end = date < start ? start : date;
    const range = [start < end ? start : end, start < end ? end : start];

    if (validateDateRange(range)) {
      setSelectedDates(range);
    } else {
      setSelectedDates([]);
    }
  };

  const handleBooking = async () => {
    if (selectedDates.length !== 2 || guests < 1) {
      alert("Please select valid dates and at least 1 guest.");
      return;
    }

    const [dateFrom, dateTo] = selectedDates;

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
          venueId: id,
        });
        setShowBookingSuccess(true);
      }
      resetForm();
      fetchVenueData();
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        alert("Booking deleted.");
        if (editingBooking?.id === bookingId) resetForm();
        fetchVenueData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  useEffect(() => {
    setSelectedDates([]);
    setAutoSelectDates(true);
  }, []);

  useEffect(() => {
    if (!venue || selectedDates.length > 0 || !autoSelectDates) return;

    const today = new Date();
    const maxLookahead = 730;

    for (let i = 0; i < maxLookahead; i++) {
      const start = new Date(today);
      start.setDate(today.getDate() + i);
      // Normalize start date
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      // Normalize end date
      end.setHours(0, 0, 0, 0);

      const isOverlapping = otherBookings.some((d) => {
        const normalizedD = new Date(d);
        normalizedD.setHours(0, 0, 0, 0);
        return normalizedD >= start && normalizedD <= end;
      });

      if (!isOverlapping) {
        setSelectedDates([start, end]);
        break;
      }
    }
  }, [venue, otherBookings, selectedDates, autoSelectDates]);

  const tileClassName = ({ date }) => {
    const isMine = allMyBookingDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    const isOther = otherBookings.some(
      (d) => d.toDateString() === date.toDateString()
    );
    const [start, end] = selectedDates;
    const isInRange = start && end && date >= start && date <= end;
    const isStart =
      start && !end && date.toDateString() === start.toDateString();

    if (isStart) return "highlighted-start";
    if (isInRange) return "highlighted-selected";
    if (isMine) return "highlighted-mine";
    if (isOther) return "highlighted-booked";

    return "";
  };

  const tileDisabled = ({ date }) => {
    if (editingBooking) {
      const start = new Date(editingBooking.dateFrom);
      const end = new Date(editingBooking.dateTo);
      if (date >= start && date <= end) return false;
    }

    return otherBookings.some((d) => d.toDateString() === date.toDateString());
  };

  if (error) return <p>{error}</p>;
  if (!venue) return <p>Loading...</p>;

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const totalDays =
    selectedDates.length === 2
      ? Math.round(
          (normalizeDate(selectedDates[1]) - normalizeDate(selectedDates[0])) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : selectedDates.length === 1
      ? 1
      : 0;

  const totalPrice = totalDays * venue.price;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 p-4 pb-24 justify-center">
        <div className="md:w-2/4">
          {venue.media?.length > 0 && (
            <div className="max-w-5xl mx-auto mt-4">
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
            <div className="md:w-1/2 w-full">
              <h1 className="text-2xl font-bold break-words">{venue.name}</h1>
              <p className="text-gray-700 mb-2 break-words">
                {venue.description}
              </p>

              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(venue.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-500">
                  ({venue.rating})
                </span>
              </div>

              <p className="mt-2">Max Guests: {venue.maxGuests}</p>
              <p>Price: ${venue.price}</p>
            </div>

            <div className="w-32 h-32 m-3 ml-auto">
              <img
                src={holizaeMark}
                className="w-32 h-32 m-3"
                alt="Holidaze logogo"
              />
            </div>
          </div>

          {venue.owner && (
            <div className="mt-4 bg-greySecond rounded-2xl flex shadow-md items-center gap-4 p-4 rounded">
              {venue.owner.avatar?.url && (
                <img
                  src={venue.owner.avatar.url}
                  alt={venue.owner.avatar.alt || "Owner avatar"}
                  width="100"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p>
                  {user ? (
                    <Link
                      to={`/profile/${venue.owner.name}`}
                      className="text-blue-600 underline"
                    >
                      {venue.owner.name}
                    </Link>
                  ) : (
                    venue.owner.name
                  )}
                </p>
                <p>{venue.owner.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col p-4">
            <h3 className="mt-4 font-semibold">Location:</h3>
            <p>
              {venue.location.address}, {venue.location.city},{" "}
              {venue.location.country}
            </p>
          </div>

          <div className="flex flex-col p-4">
            <h3 className="mt-4 font-semibold">Facilities:</h3>
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
                        {new Date(booking.dateFrom).toDateString()} –{" "}
                        {new Date(booking.dateTo).toDateString()} (
                        {booking.guests} guests)
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
                            <button
                              onClick={resetForm}
                              className="cancel-button"
                            >
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
              className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>

      {/* Sticky booking bar */}

      {selectedDates.length === 2 && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-300">
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
