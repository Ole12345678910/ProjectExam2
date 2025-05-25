import MiniCarousel from "./MiniCarousel";
import { FaStar } from "react-icons/fa";

export function VenueWithBookings({ venue, onEdit, onDelete }) {
  return (
    <li key={venue.id} className="venue-card">
      {/* Venue media carousel */}
      <MiniCarousel
        media={venue.media}
        venueName={venue.name}
        venueId={venue.id}
        showIndicators={venue.media.length > 1}
      />

      {/* Venue details med group */}
      <div className="venue-details group">
        <h3 className="venue-name">{venue.name}</h3>

        <p className="venue-description">{venue.description}</p>

        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={
                i < Math.round(venue.rating)
                  ? "rating-star-filled"
                  : "rating-star-empty"
              }
            />
          ))}
          <span className="rating-text">({venue.rating})</span>
        </div>

        <p className="price-text">Price: ${venue.price}</p>
        <p className="max-guests-text">Max Guests: {venue.maxGuests}</p>
      </div>

      {/* Edit/Delete buttons */}
      {onEdit && onDelete && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => onEdit(venue)} className="standard-button">
            Edit
          </button>
          <button onClick={() => onDelete(venue.id)} className="btn-delete">
            Delete
          </button>
        </div>
      )}

      {/* Bookings list */}
      {venue.bookings?.length ? (
        <div className="bookings-container">
          <h4 className="bookings-title">Bookings</h4>
          <ul className="booking-list">
            {venue.bookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <div className="flex items-center gap-3 mb-1">
                  {booking.customer && booking.customer.avatar ? (
                    <img
                      src={booking.customer.avatar.url}
                      alt={
                        booking.customer.avatar.alt ||
                        `${booking.customer.name || "User"}'s avatar`
                      }
                      className="booking-avatar"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="booking-avatar-placeholder">?</div>
                  )}

                  <span className="booking-customer-name">
                    {booking.customer?.name || "Unknown"}
                  </span>
                </div>

                <p>
                  <strong>From:</strong>{" "}
                  {new Date(booking.dateFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>To:</strong>{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
                <p>
                  <strong>Guests:</strong> {booking.guests}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-bookings-text">No bookings yet.</p>
      )}
    </li>
  );
}
