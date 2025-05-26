import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAllVenues, searchVenues } from "../../components/api";
import MiniCarousel from "../../components/MiniCarousel";
import { FaStar } from "react-icons/fa";

export default function Venues({
  selectedFilters,
  isEditable = false,
  onEdit,
  onDelete,
  venuesProp,
}) {
  /* ───────── search param ───────── */
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const searchTerm = params.get("search")?.toLowerCase().trim() || "";

  /* ───────── state ───────── */
  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [error, setError] = useState("");

  /* ───────── fetch / set venues ───────── */
  useEffect(() => {
    if (venuesProp) {
      setVenues(venuesProp);
    } else {
      if (searchTerm) {
        // Use API search endpoint when searchTerm exists
        searchVenues(searchTerm)
          .then((data) =>
            setVenues(
              data.data.map((v) => ({
                ...v,
                media: v.media || [],
              }))
            )
          )
          .catch((err) => setError(err.message));
      } else {
        // Fetch all venues when no searchTerm
        getAllVenues()
          .then((data) =>
            setVenues(
              data.data.map((v) => ({
                ...v,
                media: v.media || [],
              }))
            )
          )
          .catch((err) => setError(err.message));
      }
    }
  }, [venuesProp, searchTerm]);

  /* ───────── helpers ───────── */
  const handleLoadMore = () =>
    setVisibleCount((c) => Math.min(c + 10, venues.length));
  const handleLoadLess = () => setVisibleCount((c) => Math.max(c - 10, 10));

  const normalize = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, " ") || "";

  const filteredVenues = venues
    .filter((v) => {
      const searchLower = normalize(searchTerm);
      const nameMatch = normalize(v.name).includes(searchLower);
      const descriptionMatch = normalize(v.description).includes(searchLower);
      return searchLower === "" || nameMatch || descriptionMatch;
    })

    .filter((v) => {
      if (!selectedFilters?.length) return true;
      return selectedFilters.every((f) => v.meta[f] === true);
    });

  const listToShow = venuesProp
    ? filteredVenues
    : filteredVenues.slice(0, visibleCount);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mb-36 pb-9">
      <div className="max-w-5xl mx-auto py-8 flex justify-center">
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
          {listToShow.map((venue) => (
            <li
              key={venue.id}
              className="
                border-b shadow-md rounded-xl pb-6 bg-white flex flex-col
                h-full overflow-hidden w-full max-w-[20rem]
              "
            >
              <MiniCarousel
                media={venue.media}
                venueName={venue.name}
                venueId={venue.id}
                showIndicators={venue.media.length > 1}
              />

              <Link
                to={`/venues/${venue.id}`}
                className="block group p-2 flex flex-col flex-grow"
              >
                <h3 className="text-xl font-semibold break-words">
                  {venue.name}
                </h3>

                <p className="text-greyStandard mt-1 break-words line-clamp-3">
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
                  <span className="ml-1 text-sm text-greyStandard">
                    ({venue.rating})
                  </span>
                </div>

                <p className="mt-2 text-lg font-bold">Price: ${venue.price}</p>
                <p className="text-sm text-greyStandard">
                  Max Guests: {venue.maxGuests}
                </p>
              </Link>

              {isEditable && (
                <div className="mt-4 grid grid-cols-2">
                  <button
                    onClick={() => onEdit?.(venue)}
                    className="w-full px-3 py-1 bg-yellowMain text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete?.(venue.id)}
                    className="w-full px-3 py-1 bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* pagination controls – only on public Venues page */}
      {!venuesProp && (
        <div className="mt-4 justify-center">
          {visibleCount > 10 && (
            <button onClick={handleLoadLess} className="cancel-button">
              Load Less
            </button>
          )}
          {visibleCount < filteredVenues.length && (
            <button onClick={handleLoadMore} className="standard-button">
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
