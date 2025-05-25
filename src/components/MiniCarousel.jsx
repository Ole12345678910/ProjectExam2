import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const placeholderImg = "https://placehold.co/600x300?text=Image+Not+Found";

const MiniCarousel = ({ media, venueName, venueId }) => {
  const navigate = useNavigate();
  const [errorImages, setErrorImages] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  if (!media || media.length === 0) return null;

  const handleImageClick = () => {
    navigate(`/venues/${venueId}`);
  };

  const handleError = (index) => {
    setErrorImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
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
        {media.map((img, idx) => {
          const hasError = errorImages[idx];
          const hasLoaded = loadedImages[idx];
          const imageUrl = hasError ? placeholderImg : img.url;

          return (
            <div
              key={idx}
              className="relative cursor-pointer"
              onClick={handleImageClick}
            >
              {/* Container med fast størrelse for å reservere plass */}
              <div className="w-full h-48 rounded-xl overflow-hidden relative bg-gray-100">
                {/* Spinner vises mens bildet lastes */}
                {!hasLoaded && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )}

                <img
                  loading="lazy"
                  src={imageUrl}
                  {...(!hasError && {
                    srcSet: `
                      ${img.url}?w=400 400w,
                      ${img.url}?w=600 600w,
                      ${img.url}?w=900 900w
                    `,
                    sizes: "(max-width: 600px) 400px, 600px",
                  })}
                  alt={img.alt || `${venueName} image ${idx + 1}`}
                  className={`object-cover w-full h-48 rounded-xl transition-opacity duration-300 ${
                    !hasLoaded ? "opacity-0" : "opacity-100"
                  }`}
                  draggable={false}
                  onError={() => handleError(idx)}
                  onLoad={() => handleLoad(idx)}
                />
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default MiniCarousel;
