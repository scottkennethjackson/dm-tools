"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InitiativeTracker() {
  const [combatants, setCombatants] = useState([
    { id: crypto.randomUUID(), name: "" },
    { id: crypto.randomUUID(), name: "" },
  ]);

  // Add a combatant
  const handleAdd = () => {
    setCombatants((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "" },
    ]);
  };

  // Remove last combatant (min 2)
  const handleRemove = () => {
    setCombatants((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev));
  };

  // Update a combatant’s name
  const handleChange = (id, value) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );
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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">INITIATIVE TRACKER</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="font-tiamat text-xl">Please Add Combatants</h2>
          <div className="flex flex-col space-y-2 w-56">
            {combatants.map((combatant, index) => (
              <input
                key={combatant.id}
                type="text"
                placeholder={`Combatant #${index + 1}`}
                value={combatant.name}
                onChange={(e) => handleChange(combatant.id, e.target.value)}
                className="p-1 text-center text-black bg-gray-100"
              />
            ))}
          </div>

          <div className="flex space-x-4">
            {/* Add button */}
            <button
              onClick={handleAdd}
              className="bg-red active:bg-activered rounded-full cursor-pointer"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                className="size-10 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
            </button>

            {/* Remove button (disabled if only 2 remain) */}
            <button
              onClick={handleRemove}
              disabled={combatants.length <= 2}
              className={`rounded-full ${
                combatants.length > 2
                ? "bg-red cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                className="size-10 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path d="M200-440v-80h560v80H200Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={() => console.log("Next step with:", combatants)}
      >
        Next
      </button>
    </div>
  );
}
