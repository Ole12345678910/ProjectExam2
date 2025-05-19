import React, { useState } from "react";
import MainCarousel from "../components/MainCarousel";
import Venues from "./Venues";
import Slider from "react-slick";
import { PiPawPrint } from "react-icons/pi";
import { IoWifiOutline } from "react-icons/io5";
import { PiEggCrackLight } from "react-icons/pi";
import { LuCircleParking } from "react-icons/lu";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const filterItems = [
    { id: "pets", label: "Pet-Friendly Stays", icon: <PiPawPrint /> },
    { id: "wifi", label: "WiFi Ready", icon: <IoWifiOutline /> },
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

  return (
    <div>
      <MainCarousel />

      <div className="bg-white max-w-5xl mx-auto px-4 -mt-20 relative z-10 rounded-t-3xl px-6 py-3 flex place-content-between">
        <div>
          <h2 className="font-Montserrat text-3xl">Stay better. Book easier.</h2>
          <p>Designed for explorers, built for ease — your next great stay is just a tap away</p>
          <p className="mt-4 font-semibold">Why Book With SnapBook?</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><span className="font-medium">Curated Stays:</span> Handpicked quality places — no guesswork, no stress.</li>
            <li><span className="font-medium">Fast & Simple:</span> Book in just a few clicks — built for speed and ease.</li>
            <li><span className="font-medium">Pet-Friendly:</span> Easily find places for furry companions.</li>
            <li><span className="font-medium">Smart Amenities:</span> Know exactly what you get — Wi-Fi, breakfast, etc.</li>
          </ul>
        </div>
        <img className="w-32 h-32 m-3" src="/src/assets/SnapBookMark.png" alt="SnapBook logo" />
      </div>

      <div className="bg-greySecond">
        {/* 🔁 Filter Carousel */}
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

        {/* Pass selectedFilters as a prop to Venues */}
        <Venues selectedFilters={selectedFilters} />
      </div>
    </div>
  );
};

export default Home;



