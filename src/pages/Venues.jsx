import { useEffect, useState } from "react";
import { getAllVenues } from "../components/api";
import { Link } from "react-router-dom";
import MiniCarousel from "../components/MiniCarousel";
import { FaStar } from "react-icons/fa";

const Venues = ({ selectedFilters }) => {
  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllVenues()
      .then((data) => setVenues(data.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((count) => Math.min(count + 10, venues.length));
  };

  const handleLoadLess = () => {
    setVisibleCount((count) => Math.max(count - 10, 10));
  };

  if (error) return <p className="text-red-500">{error}</p>;


  const filteredVenues = venues
    .filter((venue) => venue.id)
    .filter((venue) => {
      if (!selectedFilters || selectedFilters.length === 0) return true;
      return selectedFilters.every((filter) => venue.meta[filter] === true);
    });

  return (
    <div className="mb-36 pb-9">
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center ">
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-stretch">
          {filteredVenues.slice(0, visibleCount).map((venue) => (
            <li
              key={venue.id}
              className="border-b shadow-md rounded-xl pb-6 bg-white flex flex-col h-full w-full"
            >
              <MiniCarousel
                media={venue.media}
                venueName={venue.name}
                venueId={venue.id}
              />

              <Link
                to={`/venues/${venue.id}`}
                className="block group p-2 flex flex-col flex-grow h-full"
              >
                <h3 className="text-xl font-semibold break-words">
                  {venue.name}
                </h3>
                <p className="text-gray-600 mt-1 break-words line-clamp-3">
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

                <p className="mt-2 text-lg font-bold">Price: ${venue.price}</p>
                <p className="text-sm text-gray-500">
                  Max Guests: {venue.maxGuests}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        {visibleCount > 10 && (
          <button
            onClick={handleLoadLess}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Load Less
          </button>
        )}

        {visibleCount < filteredVenues.length && (
          <button
            onClick={handleLoadMore}
            className="standard-button"
          >
            Load-more
          </button>
        )}
      </div>
    </div>
  );
};

export default Venues;
