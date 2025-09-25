"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InitiativeTracker() {
  const router = useRouter();

  const [stage, setStage] = useState(1); // 1 = add combatants, 2 = initiatives, 3 = tracker
  const [combatants, setCombatants] = useState([
    { id: crypto.randomUUID(), name: "", initiative: "" },
    { id: crypto.randomUUID(), name: "", initiative: "" },
  ]);

  // Add a combatant
  const handleAdd = () => {
    setCombatants((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", initiative: "" },
    ]);
  };

  // Remove last combatant (min 2)
  const handleRemove = () => {
    setCombatants((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev));
  };

  // Update name
  const handleNameChange = (id, value) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );
  };

  // Update initiative
  const handleInitChange = (id, value) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, initiative: value } : c))
    );
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 space-y-6 min-h-screen">
      {/* Home Button */}
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

      {/* Header */}
      <div className="flex flex-col items-center">
        <Image
          src="/images/ampersand.png"
          width={240}
          height={240}
          alt="D&D"
        />
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">INITIATIVE TRACKER</h1>
      </div>

      {/* Stage 1: Add Combatants */}
      {stage === 1 && (
        <>
          <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
            <h2 className="font-roboto text-lg font-bold uppercase">Please Add Combatants</h2>
            <div className="flex flex-col space-y-2 min-w-64 max-w-80">
              {combatants.map((combatant, index) => (
                <input
                  key={combatant.id}
                  type="text"
                  placeholder={`Combatant #${index + 1}`}
                  value={combatant.name}
                  onChange={(e) =>
                    handleNameChange(combatant.id, e.target.value)
                  }
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

              {/* Remove button */}
              <button
                onClick={handleRemove}
                disabled={combatants.length <= 2}
                className={`rounded-full ${
                  combatants.length > 2
                    ? "bg-red active:bg-activered cursor-pointer"
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

          {/* Next button outside the box */}
          <button
            className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
            onClick={() => setStage(2)}
          >
            Next...
          </button>
        </>
      )}

      {/* Stage 2: Enter Initiatives */}
      {stage === 2 && (
        <>
          <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
            <h2 className="font-roboto text-lg font-bold uppercase">Enter Initiative</h2>
            <div className="flex flex-col space-y-2 min-w-64 max-w-full">
              {combatants.map((combatant, index) => (
                <div
                  key={combatant.id}
                  className="flex justify-between items-center space-x-2"
                >
                  {/* fallback to Combatant #N */}
                  <span className="font-tiamat text-2xl bg-black truncate">{combatant.name || `Combatant #${index + 1}`}</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={combatant.initiative}
                    onChange={(e) =>
                      handleInitChange(combatant.id, e.target.value)
                    }
                    className="p1 min-w-16 text-center text-black bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Start Combat button outside the box */}
          <button
            className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
            onClick={() => setStage(3)}
          >
            Go!
          </button>
        </>
      )}
    </div>
  );
}
