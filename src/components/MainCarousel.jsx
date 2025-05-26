// Import React hooks, API function, routing, and carousel components
import { useEffect, useState } from "react";
import { getAllVenues } from "./api";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Component to display a single venue slide in the carousel
const VenueSlide = ({ venue }) => {
  // State to track if the image has loaded
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/venues/${venue.id}`} // Link to venue details page
      aria-label={`View details for ${venue.name}`} // Accessibility label
      className="block relative cursor-pointer max-h-[400px] w-full overflow-hidden bg-gray-200"
    >
      {venue.media.length > 0 && (
        <>
          {/* Show a placeholder loading animation until image is loaded */}
          {!loaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
          )}
          {/* Venue image */}
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="w-full h-[400px] object-cover"
            onLoad={() => setLoaded(true)} // Set loaded to true when image finishes loading
          />
          {/* Gradient overlay for visual effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
        </>
      )}
    </Link>
  );
};

// Main carousel component that fetches and displays venues
const MainCarousel = () => {
  // State to store venues and any error messages
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");

  // Fetch venues on component mount
  useEffect(() => {
    getAllVenues()
      .then((data) => {
        // Store only the first 4 venues for the carousel
        setVenues(data.data.slice(0, 4)); 
      })
      .catch((err) => setError(err.message)); // Handle errors by setting error state
  }, []);

  // Preload the first venue's image for better performance
  useEffect(() => {
    if (venues.length > 0 && venues[0].media.length > 0) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = venues[0].media[0].url;

      // Add preload link to the document head
      document.head.appendChild(link);

      // Cleanup: remove preload link when component unmounts or venues change
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [venues]);

  // If there's an error, display it
  if (error) return <p>{error}</p>;

  return (
    <div className="main-carousel">
      <Carousel
        showThumbs={false}        // Hide thumbnail previews
        showStatus={false}        // Hide status indicator
        infiniteLoop              // Enable infinite looping of slides
        useKeyboardArrows         // Allow navigation with keyboard arrows
        swipeable                 // Allow swipe gestures on touch devices
        emulateTouch              // Simulate touch events on desktop
        autoPlay                  // Automatically play the carousel
        interval={3000}           // 3 seconds between slide transitions
        stopOnHover               // Pause autoplay when hovering over carousel
      >
        {/* Render a slide for each venue */}
        {venues.map((venue) => (
          <VenueSlide key={venue.id} venue={venue} />
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
