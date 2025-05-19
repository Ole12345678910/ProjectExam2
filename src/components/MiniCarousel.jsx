import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MiniCarousel = ({ media, venueName, venueId }) => {
  const navigate = useNavigate();

  if (!media || media.length === 0) return null;

  const handleImageClick = () => {
    navigate(`/venues/${venueId}`);
  };

  return (
    <div>
      <Carousel
        showThumbs={false}
        showStatus={false}
        showIndicators={media.length > 1}
        infiniteLoop={media.length > 1}
        swipeable={media.length > 1}
        emulateTouch
        autoPlay={false}
        className="max-w-md rounded-xl overflow-hidden relative"
      >
        {media.map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={img.url}
              alt={img.alt || `${venueName} image ${idx + 1}`}
              className="object-cover h-48 w-full rounded-xl"
              draggable={false}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MiniCarousel;
