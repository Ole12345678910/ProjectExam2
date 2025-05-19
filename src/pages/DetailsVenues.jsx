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

function DetailVenues() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [guests, setGuests] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const today = new Date();
  const currentYear = today.getFullYear();
  const minDate = new Date(currentYear - 5, 0, 1); // 5 years back
  const maxDate = new Date(currentYear + 10, 11, 31); // 10 years ahead

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
      await createBooking({
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests,
        venueId: id,
      });
      setShowBookingSuccess(true);
      resetForm();
      fetchVenueData();
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  };

  const handleEditBooking = async () => {
    if (!editingBooking || selectedDates.length < 2) {
      alert("Please select a valid date range.");
      return;
    }

    const [dateFrom, dateTo] = selectedDates;

    try {
      await updateBooking(editingBooking.id, {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        guests,
      });
      alert("Booking updated!");
      resetForm();
      fetchVenueData();
    } catch (err) {
      alert("Failed to update booking: " + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId);
        alert("Booking deleted.");
        fetchVenueData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

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

  const totalDays =
    selectedDates.length === 2
      ? Math.ceil(
          (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;
  const totalPrice = totalDays * venue.price;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 justify-center">
      <div className="md:w-2/3">
        {venue.media?.length > 0 && (
          <div className="max-w-3xl mx-auto mt-4">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              useKeyboardArrows
              swipeable
              emulateTouch
              autoPlay
              interval={4000}
              showIndicators={venue.media.length > 1} // 👈 Hide dots if only one image
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

        <div className="flex">
          {/* LEFT: Text content */}
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

          {/* RIGHT: Image */}
          <div className="w-32 h-32 m-3 ml-auto">
            <img
              className="flex justify-end"
              src="/src/assets/SnapBookMark.png"
              alt="SnapBook logo"
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
                {" "}
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

        {/* Location */}
        <div className="flex flex-col p-4">
          <h3 className="mt-4 font-semibold">Location:</h3>
          <p>
            {venue.location.address}, {venue.location.city},{" "}
            {venue.location.country}
          </p>
        </div>

        {/* Facilities */}
        <div className="flex flex-col p-4">
          <h3 className="mt-4 font-semibold">Facilities:</h3>
          <ul className="list-disc pl-5">
            <li>Wifi: {venue.meta.wifi ? "Yes" : "No"}</li>
            <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
            <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
            <li>Pets: {venue.meta.pets ? "Yes" : "No"}</li>
          </ul>
        </div>
        <div className="flex">
          {/* Calendar */}
          <div className="ml-auto">
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
        </div>

        {totalDays > 0 && (
          <div>
            <p>
              <strong>Days selected:</strong> {totalDays}
            </p>
            <p>
              <strong>Total price:</strong> ${totalPrice}
            </p>
          </div>
        )}

        <h3 className="mt-4">Guests:</h3>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
          min={1}
          max={venue.maxGuests}
          className="border p-1 mb-2"
        />

        {editingBooking === null && (
          <div className="flex gap-4 mt-2">
            <button onClick={handleBooking} className="standard-button">
              Book
            </button>
          </div>
        )}

        {showBookingSuccess && (
          <p className="text-green-600 mt-2">Booking Successful!</p>
        )}

        {/* ─── Your Bookings ─── */}
        <h3 className="mt-6">Your Bookings:</h3>
        <ul>
          {myBookings.map(({ booking }, i) => {
            const isEditing = editingBooking?.id === booking.id;

            return (
              <li
                key={i}
                className={`
          mb-2 p-2 rounded
          ${isEditing ? "bg-yellow-50 ring-2 ring-yellow-400" : ""}
        `}
              >
                <p>
                  {new Date(booking.dateFrom).toDateString()} –{" "}
                  {new Date(booking.dateTo).toDateString()} ({booking.guests}{" "}
                  guests)
                  {isEditing && (
                    <span className="ml-2 text-xs font-semibold text-yellow-600">
                      editing…
                    </span>
                  )}
                </p>

                {/* normal view buttons */}
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
                      className="text-blue-600 underline mr-2"
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

                {/* inline edit-state buttons */}
                {isEditing && (
                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={handleEditBooking}
                      className="standard-button px-3 py-1"
                    >
                      Save changes
                    </button>
                    <button onClick={resetForm} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DetailVenues;
