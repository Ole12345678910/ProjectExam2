import React, { useState } from "react";
import MainCarousel from "../components/MainCarousel";
import Venues from "./Venues";
import Slider from "react-slick";
import { PiPawPrint } from "react-icons/pi";
import { IoWifiOutline } from "react-icons/io5";
import { PiEggCrackLight } from "react-icons/pi";
import { LuCircleParking } from "react-icons/lu";
import holizaeMark from "../assets/holizaeMark.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  /* ───── Available filters ───── */
  const filterItems = [
    { id: "pets", label: "Pet-Friendly Stays", icon: <PiPawPrint /> },
    { id: "wifi", label: "Wi-Fi Ready", icon: <IoWifiOutline /> },
    { id: "breakfast", label: "Breakfast Included", icon: <PiEggCrackLight /> },
    { id: "parking", label: "Parking Available", icon: <LuCircleParking /> },
  ];

  /* ───── State ───── */
  const [selectedFilters, setSelectedFilters] = useState([]);

  /* ───── Helpers ───── */
  const toggleFilter = (filterId) => {
    setSelectedFilters(
      (prev) =>
        prev.includes(filterId)
          ? prev.filter((f) => f !== filterId) // remove
          : [...prev, filterId] // add
    );
  };

  const removeFilter = (filterId) =>
    setSelectedFilters((prev) => prev.filter((f) => f !== filterId));

  /* ───── Slider settings ───── */
  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2.5 } },
      { breakpoint: 500, settings: { slidesToShow: 1.5 } },
    ],
  };

  /* ───── Render ───── */
  return (
    <div>
      {/* Hero carousel */}
      <MainCarousel />

      {/* Intro banner */}
      <div className="bg-white max-w-5xl mx-auto px-4 -mt-20 relative z-10 rounded-t-3xl px-6 py-3 flex place-content-between">
        <div>
          <h2 className="font-Montserrat text-3xl">
            Stay better. Book easier.
          </h2>
          <p>
            Designed for explorers, built for ease — your next great stay is
            just a tap away
          </p>
          <p className="mt-4 font-semibold">Why Book With Holidaze?</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <span className="font-medium">Curated Stays:</span> Hand-picked
              quality places — no guesswork, no stress.
            </li>
            <li>
              <span className="font-medium">Fast &amp; Simple:</span> Book in
              just a few clicks — built for speed and ease.
            </li>
            <li>
              <span className="font-medium">Pet-Friendly:</span> Easily find
              places for furry companions.
            </li>
            <li>
              <span className="font-medium">Smart Amenities:</span> Know exactly
              what you get — Wi-Fi, breakfast, etc.
            </li>
          </ul>
        </div>
        <img
          src={holizaeMark}
          className="w-32 h-32 m-3"
          alt="Holidaze logogo"
        />
      </div>

      {/* Main content section */}
      <div className="bg-greySecond">
        {/* ─── Filter carousel ─── */}
        <div className="pt-10 px-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl">
            <Slider {...settings}>
              {filterItems.map((item) => (
                <div key={item.id} className="px-2">
                  <button
                    className="w-full font-medium py-4 px-6 flex flex-col items-center justify-center gap-y-2 transition"
                    onClick={() => toggleFilter(item.id)}
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

        {/* ─── Chip-bar showing active filters ─── */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 px-6 mt-4 max-w-6xl mx-auto flex justify-center">
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

        {/* ─── Venue list ─── */}
        <Venues selectedFilters={selectedFilters} />
      </div>
    </div>
  );
};

export default Home;
