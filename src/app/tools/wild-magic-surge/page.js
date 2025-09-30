"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WildMagicSurge() {
  const router = useRouter();

  const [effects, setEffects] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/json/wild-magic.json")
      .then((res) => res.json())
      .then((data) => setEffects(data))
      .catch((err) => console.error("Error loading wild magic:", err));
  }, []);

  function rollEffect() {
    const roll = Math.ceil(Math.random() * 100);
    const effect = effects.find(
      (entry) => roll >= entry.min && roll <= entry.max
    );

    if (effect) {
      setResult({
        title: "What Happens:",
        description: effect.description,
      });
    } else {
      console.warn("Roll outside 1–100:", roll);
      setResult({
        title: "No Effect Found",
        description: "Please try again.",
      });
    }
  }

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
          alt="D&D"
        />
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">
          WILD MAGIC SURGE
        </h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-2 w-full max-w-md border-2 border-red">
        <h2 className="font-tiamat text-3xl text-center">
          {result ? result.title : "Roll for Wild Magic"}
        </h2>
        {result && (
          <p className="text-justify">
            {result.description}
          </p>
        )}
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={rollEffect}
        disabled={effects.length === 0}
      >
        Roll!
      </button>
    </div>
  );
}
