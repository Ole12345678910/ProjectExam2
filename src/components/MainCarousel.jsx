import { useEffect, useState } from "react";
import { getAllVenues } from "./api";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const VenueSlide = ({ venue }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/venues/${venue.id}`}
      aria-label={`View details for ${venue.name}`}
      className="block relative cursor-pointer max-h-[400px] w-full overflow-hidden bg-gray-200"
    >
      {venue.media.length > 0 && (
        <>
          {!loaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
          )}
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="w-full h-[400px] object-cover"
            onLoad={() => setLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
        </>
      )}
    </Link>
  );
};

const MainCarousel = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllVenues()
      .then((data) => {
        setVenues(data.data.slice(0, 4)); // henter top 4 venues
      })
      .catch((err) => setError(err.message));
  }, []);

  // Her legger vi til preload for det første bildet så snart venues er satt
  useEffect(() => {
    if (venues.length > 0 && venues[0].media.length > 0) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = venues[0].media[0].url;

      document.head.appendChild(link);

      // Fjern preload-link når komponent unmountes eller venues endres
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [venues]);

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
          <VenueSlide key={venue.id} venue={venue} />
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
