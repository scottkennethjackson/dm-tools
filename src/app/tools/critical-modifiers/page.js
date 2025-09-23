"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CriticalModifiers() {
  const router = useRouter();

  const [effectsArray, setEffectsArray] = useState(null);
  const [status, setStatus] = useState("hit");
  const [attackType, setAttackType] = useState("melee");
  const [rollResult, setRollResult] = useState(null);

  useEffect(() => {
    fetch("/json/critical-modifiers.json")
      .then((res) => res.json())
      .then((data) => setEffectsArray(data))
      .catch((err) => console.error("Error loading effects data:", err));
  }, []);

  const handleRoll = () => {
    if (!effectsArray) return;

    const roll = Math.ceil(Math.random() * 100);
    const statusArray = effectsArray[status];
    if (!statusArray) return;

    const typeObj = statusArray.find((entry) => entry[attackType]);
    if (!typeObj || !typeObj[attackType]) return;

    const effect = typeObj[attackType].find(
      (entry) => roll >= entry.min && roll <= entry.max
    );

    if (effect) {
      setRollResult({ title: effect.effect, description: effect.description });
    } else {
      setRollResult({
        title: "No Effect Found",
        description: `No matching effect found for roll ${roll}`,
      });
      console.warn("Roll outside expected range:", roll);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 space-y-6 min-h-screen">
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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">CRITICAL HIT/MISS MODIFIERS</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="flex flex-col items-center space-y-1">
          <h2
            className={`font-tiamat text-center ${rollResult ? "text-2xl" : "text-3xl"}`}
          >
            {rollResult ? rollResult.title : "Select Hit or Miss & Attack Type"}
          </h2>
          {rollResult && (
            <p>{rollResult.description}</p>
          )}
        </div>

        <div className="space-y-3 w-full">
          <div className="flex justify-around mx-auto max-w-64">
            <label className="space-x-1">
              <input
                type="radio"
                name="status"
                value="hit"
                className="accent-red"
                checked={status === "hit"}
                onChange={() => setStatus("hit")}
              />
              <span>Critical Hit</span>
            </label>

            <label className="space-x-1">
              <input
                type="radio"
                name="status"
                value="miss"
                className="accent-red"
                checked={status === "miss"}
                onChange={() => setStatus("miss")}
              />
              <span>Critical Miss</span>
            </label>
          </div>

          <div className="relative">
            <hr className="border-red"></hr>
            <p className="absolute -top-3 left-1/2 -translate-x-1/2 px-1 font-serif text-sm italic bg-black">attack type</p>
          </div>

          <div className="flex justify-around mx-auto max-w-64">
            <label className="space-x-1">
              <input
                type="radio"
                name="attack-type"
                value="melee"
                className="accent-red"
                checked={attackType === "melee"}
                onChange={() => setAttackType("melee")}
              />
              <span>Melee</span>
            </label>

            <label className="space-x-1">
              <input
                type="radio"
                name="attack-type"
                value="ranged"
                className="accent-red"
                checked={attackType === "ranged"}
                onChange={() => setAttackType("ranged")}
              />
              <span>Ranged</span>
            </label>

            <label className="space-x-1">
              <input
                type="radio"
                name="attack-type"
                value="spell"
                className="accent-red"
                checked={attackType === "spell"}
                onChange={() => setAttackType("spell")}
              />
              <span>Spell</span>
            </label>
          </div>
        </div>
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={handleRoll}
      >
        Roll!
      </button>
    </div>
  );
};
