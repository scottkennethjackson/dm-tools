"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BagOfTricks() {
  const router = useRouter();

  const [beasts, setBeasts] = useState({ walking: [], flying: [], swimming: [] });
  const [selectedType, setSelectedType] = useState("walking");
  const [rolledBeast, setRolledBeast] = useState(null);

  useEffect(() => {
    const fetchBeasts = async () => {
      try {
        const response = await fetch("/json/beasts.json");
        const data = await response.json();
        setBeasts(data);
      } catch (error) {
        console.error("Error loading beasts.json:", error);
      }
    };
    fetchBeasts();
  }, []);

  const rollBeast = () => {
    const beastArray = beasts[selectedType] || [];
    if (beastArray.length === 0) {
      setRolledBeast(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * beastArray.length);
    setRolledBeast(beastArray[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 space-y-6 min-h-screen">
      <button
        aria-label="Home"
        className="absolute top-5 right-6 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className="size-10 fill-gray-400 hover:fill-red active:fill-activered"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
        >
          <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
        </svg>
      </button>

      <div className="flex flex-col items-center">
        <Image
          src="/images/ampersand.png"
          width={240}
          height={240}
          alt="D&D" />
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">BAG OF TRICKS</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="text-center">
          <h2 className="font-tiamat text-3xl">
            {rolledBeast ? rolledBeast.name : "Select Beast Type"}
          </h2>

          {rolledBeast && (
            <a
              href={rolledBeast.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red active:text-activered underline"
            >
              View Statblock
            </a>
          )}
        </div>

        <div className="flex space-x-4">
          <label className="space-x-1">
            <input
              type="radio"
              name="beast"
              value="walking"
              checked={selectedType === "walking"}
              onChange={(e) => setSelectedType(e.target.value)}
              className="accent-red"
            />
            <span>Walking</span>
          </label>

          <label className="space-x-1">
            <input
              type="radio"
              name="beast"
              value="flying"
              checked={selectedType === "flying"}
              onChange={(e) => setSelectedType(e.target.value)}
              className="accent-red"
            />
            <span>Flying</span>
          </label>

          <label className="space-x-1">
            <input
              type="radio"
              name="beast"
              value="swimming"
              checked={selectedType === "swimming"}
              onChange={(e) => setSelectedType(e.target.value)}
              className="accent-red"
            />
            <span>Swimming</span>
          </label>
        </div>
      </div>

      <button
        onClick={rollBeast}
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
      >
        Roll!
      </button>
    </div>
  );
};
