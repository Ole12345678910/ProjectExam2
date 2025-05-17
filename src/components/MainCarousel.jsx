import { useEffect, useState } from "react";
import { getAllVenues } from "./api";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MainCarousel = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllVenues()
      .then((data) => {
        setVenues(data.data.slice(0, 4)); // top 4 venues
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="main-carousel">  
    <Carousel
      showThumbs={false}
      showStatus={false}
      infiniteLoop
      useKeyboardArrows
      swipeable
      emulateTouch
      autoPlay
      interval={3000}
      stopOnHover
    >
      {venues.map((venue) => (
        <Link
          key={venue.id}
          to={`/venues/${venue.id}`}
          aria-label={`View details for ${venue.name}`}
          className="block relative cursor-pointer max-h-[400px] w-full overflow-hidden"
        >
          {venue.media.length > 0 && (
            <>
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt || venue.name}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </>
          )}
        </Link>
      ))}
    </Carousel>
    </div>
  );
};

export default MainCarousel;
