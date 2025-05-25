import React, { useState } from "react";
import Slider from "react-slick";
import { PiPawPrint, PiEggCrackLight } from "react-icons/pi";
import { IoWifiOutline } from "react-icons/io5";
import { LuCircleParking } from "react-icons/lu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MainCarousel from "../../components/MainCarousel";
import Venues from "../venue/Venues";
import holizaeMark from "../../assets/holizaeMark.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrows
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="left-0 -ml-5 filter-arrow"
    aria-label="Previous"
  >
    <IoIosArrowBack />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="right-0 -mr-5 filter-arrow"
    aria-label="Next"
  >
    <IoIosArrowForward />
  </button>
);

const Home = () => {
  const filterItems = [
    { id: "pets", label: "Pet-Friendly Stays", icon: <PiPawPrint /> },
    { id: "wifi", label: "Wi-Fi Ready", icon: <IoWifiOutline /> },
    { id: "breakfast", label: "Breakfast Included", icon: <PiEggCrackLight /> },
    { id: "parking", label: "Parking Available", icon: <LuCircleParking /> },
  ];

  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const removeFilter = (filterId) =>
    setSelectedFilters((prev) => prev.filter((f) => f !== filterId));

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2.5 } },
      { breakpoint: 500, settings: { slidesToShow: 1.5 } },
    ],
  };

  return (
    <div>
      <MainCarousel />
      <div className="introbanner">
        <div className="flex-1 pr-6">
          <h2 className="font-Montserrat text-3xl">
            Stay better. Book easier.
          </h2>
          <p>
            Designed for explorers, built for ease — your next great stay is
            just a tap away
          </p>

          <div className="hidden md:block mt-4">
            <strong>
              <p className="mt-4">Why Book With Holidaze?</p>
            </strong>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <span>Curated Stays:</span> Hand-picked quality places — no
                guesswork, no stress.
              </li>
              <li>
                <span>Fast & Simple:</span> Book in just a few clicks — built
                for speed and ease.
              </li>
              <li>
                <span>Pet-Friendly:</span> Easily find places for furry
                companions.
              </li>
              <li>
                <span>Smart Amenities:</span> Know exactly what you get — Wi-Fi,
                breakfast, etc.
              </li>
            </ul>
          </div>
        </div>

        <img
          src={holizaeMark}
          alt="Holidaze logo"
          width={128}
          height={64}
          className="object-contain self-start"
        />
      </div>

      <div className="bg-greySecond">
        <div className="pt-10 px-6 max-w-6xl mx-auto relative">
          <div className="bg-white rounded-2xl">
            <Slider {...settings}>
              {filterItems.map((item) => (
                <div key={item.id} className="px-2">
                  <button
                    onClick={() => toggleFilter(item.id)}
                    className="w-full font-medium py-4 px-6 flex flex-col items-center justify-center gap-y-2 transition"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <span
                      className={`text-sm text-center ${
                        selectedFilters.includes(item.id)
                          ? "underline decoration-mainBlack decoration-2"
                          : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Chip filters */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 px-6 mt-4 max-w-6xl mx-auto justify-center">
            {selectedFilters.map((id) => {
              const item = filterItems.find((f) => f.id === id);
              return (
                <span
                  key={id}
                  className="flex items-center gap-1 bg-white rounded-full px-4 py-1 shadow text-sm"
                >
                  {item.icon}
                  {item.label}
                  <button
                    onClick={() => removeFilter(id)}
                    className="ml-1 text-lg leading-none hover:text-red-600"
                    aria-label={`Remove ${item.label}`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Venue list */}
        <Venues selectedFilters={selectedFilters} />
      </div>
    </div>
  );
};

export default Home;
