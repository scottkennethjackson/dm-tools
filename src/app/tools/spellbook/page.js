"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Spellbook() {
  const router = useRouter();

  const [spells, setSpells] = useState({});
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [chaos, setChaos] = useState(false);
  const [spell, setSpell] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/json/spells.json")
      .then((res) => res.json())
      .then((data) => {
        setSpells({
          0: data.cantrips,
          1: data["1st level"],
          2: data["2nd level"],
          3: data["3rd level"],
          4: data["4th level"],
          5: data["5th level"],
          6: data["6th level"],
          7: data["7th level"],
          8: data["8th level"],
          9: data["9th level"],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load spells:", err);
        setLoading(false);
      });
  }, []);

  function getOrdinalSuffix(level) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = level % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || "th";
  }

  function rollSpell() {
    if (loading) return;

    let spellList, spellLevel;

    if (chaos) {
      const levelRoll = Math.floor(Math.random() * 10);
      spellList = spells[levelRoll];
      spellLevel =
        levelRoll === 0
          ? "Cantrip"
          : `${levelRoll}${getOrdinalSuffix(levelRoll)} Level`;
    } else {
      spellList = spells[selectedLevel];
      spellLevel =
        selectedLevel === 0
          ? "Cantrip"
          : `${selectedLevel}${getOrdinalSuffix(selectedLevel)} Level`;
    }

    if (!spellList || spellList.length === 0) {
      setSpell({ name: "No Spells Available", level: "", link: null });
      return;
    }

    const pick = spellList[Math.floor(Math.random() * spellList.length)];
    setSpell({ ...pick, level: spellLevel });
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
          SPELLBOOK
        </h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="text-center">
          <h2 className="font-tiamat text-3xl text-center">
            {spell
              ? `${spell.name} ${spell.level ? `(${spell.level})` : ""}`
              : "Roll to Generate Spell"}
          </h2>
  
          {spell?.link && (
            <a
              href={spell.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red active:text-activered underline"
            >
              View Spell
            </a>
          )}
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="space-x-1">
              <span>Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="py-1 bg-gray-100 text-black"
                disabled={chaos}
              >
                <option value={0}>0</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center space-x-1">
            <span>Choose Chaos:</span>
            <label>
              <input
                type="checkbox"
                className="accent-red"
                checked={chaos}
                onChange={(e) => setChaos(e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={rollSpell}
        disabled={loading}
      >
        Roll!
      </button>
    </div>
  );
}
