import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Placeholder image URL for failed image loads
const placeholderImg = "https://placehold.co/600x300?text=Image+Not+Found";

// MiniCarousel component to show venue images in a small carousel
const MiniCarousel = ({ media, venueName, venueId }) => {
  const navigate = useNavigate();
  
  // State to track which images had load errors
  const [errorImages, setErrorImages] = useState({});
  
  // State to track which images have successfully loaded
  const [loadedImages, setLoadedImages] = useState({});

  // If there are no images, render nothing
  if (!media || media.length === 0) return null;

  // Navigate to venue details when image clicked
  const handleImageClick = () => {
    navigate(`/venues/${venueId}`);
  };

  // Mark image as errored to show placeholder instead
  const handleError = (index) => {
    setErrorImages((prev) => ({ ...prev, [index]: true }));
  };

  // Mark image as loaded to update UI (fade in)
  const handleLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div>
      <Carousel
        showThumbs={false}                     // Hide thumbnails below carousel
        showStatus={false}                     // Hide slide status indicator
        showIndicators={media.length > 1}     // Show indicators only if multiple images
        infiniteLoop={media.length > 1}       // Enable infinite looping only if multiple images
        swipeable={media.length > 1}          // Allow swipe gestures only if multiple images
        emulateTouch                          // Enable touch emulation on desktop
        autoPlay={false}                      // Disable auto play
        className="max-w-md rounded-xl overflow-hidden relative"
      >
        {/* Render each image inside the carousel */}
        {media.map((img, idx) => {
          const hasError = errorImages[idx];  // Check if this image failed to load
          const hasLoaded = loadedImages[idx];// Check if this image has loaded
          const imageUrl = hasError ? placeholderImg : img.url; // Use placeholder if error

          return (
            <div
              key={img.url} // Use image URL as unique key
              className="relative cursor-pointer"
              onClick={handleImageClick} // Navigate on click
            >
              <div className="w-full h-48 rounded-xl overflow-hidden relative bg-greyStandard">
                {/* Show loading spinner while image loads */}
                {!hasLoaded && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )}

                {/* Image element with lazy loading and responsive srcSet */}
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
                  alt={img.alt || `${venueName} image ${idx + 1}`} // Alt text for accessibility
                  className={`object-cover w-full h-48 rounded-xl transition-opacity duration-300 ${
                    !hasLoaded ? "opacity-0" : "opacity-100" // Fade in after load
                  }`}
                  draggable={false}
                  onError={() => handleError(idx)} // Handle load errors
                  onLoad={() => handleLoad(idx)}   // Handle successful loads
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
