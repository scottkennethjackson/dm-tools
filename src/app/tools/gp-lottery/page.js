"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GPLottery() {
  const router = useRouter();

  const [level, setLevel] = useState(1);
  const [hoard, setHoard] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const [showLink, setShowLink] = useState(false);

  const rollD100 = () => Math.ceil(Math.random() * 100);

  const rollMultiple = (numRolls, diceValue) => {
    let total = 0;
    for (let i = 0; i < numRolls; i++) {
      total += Math.ceil(Math.random() * diceValue);
    }
    return total;
  };

  const determineLoot = (level, hoard, roll) => {
    let coins = [];

    if (level <= 4) {
      if (!hoard) {
        if (roll <= 30) coins.push({ value: rollMultiple(5, 6), currency: "CP" });
        else if (roll <= 60) coins.push({ value: rollMultiple(4, 6), currency: "SP" });
        else if (roll <= 70) coins.push({ value: rollMultiple(3, 6), currency: "EP" });
        else if (roll <= 95) coins.push({ value: rollMultiple(3, 6), currency: "GP" });
        else coins.push({ value: rollMultiple(1, 6), currency: "PP" });
      } else {
        coins.push(
          { value: rollMultiple(6, 6) * 100, currency: "CP" },
          { value: rollMultiple(3, 6) * 100, currency: "SP" },
          { value: rollMultiple(2, 6) * 10, currency: "GP" }
        );
      }
    } else if (level <= 10) {
      if (!hoard) {
        if (roll <= 30) {
          coins.push(
            { value: rollMultiple(4, 6) * 100, currency: "CP" },
            { value: rollMultiple(1, 6) * 10, currency: "EP" }
          );
        } else if (roll <= 60) {
          coins.push(
            { value: rollMultiple(6, 6) * 10, currency: "SP" },
            { value: rollMultiple(2, 6) * 10, currency: "GP" }
          );
        } else if (roll <= 70) {
          coins.push(
            { value: rollMultiple(3, 6) * 10, currency: "EP" },
            { value: rollMultiple(2, 6) * 10, currency: "GP" }
          );
        } else if (roll <= 95) {
          coins.push({ value: rollMultiple(4, 6) * 10, currency: "GP" });
        } else {
          coins.push(
            { value: rollMultiple(2, 6) * 10, currency: "GP" },
            { value: rollMultiple(3, 6), currency: "PP" }
          );
        }
      } else {
        coins.push(
          { value: rollMultiple(2, 6) * 100, currency: "CP" },
          { value: rollMultiple(2, 6) * 1000, currency: "SP" },
          { value: rollMultiple(6, 6) * 100, currency: "GP" },
          { value: rollMultiple(3, 6) * 10, currency: "PP" }
        );
      }
    } else if (level <= 16) {
      if (!hoard) {
        if (roll <= 20) {
          coins.push(
            { value: rollMultiple(4, 6) * 100, currency: "SP" },
            { value: rollMultiple(1, 6) * 100, currency: "GP" }
          );
        } else if (roll <= 35) {
          coins.push(
            { value: rollMultiple(1, 6) * 100, currency: "EP" },
            { value: rollMultiple(1, 6) * 100, currency: "GP" }
          );
        } else if (roll <= 75) {
          coins.push(
            { value: rollMultiple(2, 6) * 100, currency: "GP" },
            { value: rollMultiple(1, 6) * 10, currency: "PP" }
          );
        } else {
          coins.push(
            { value: rollMultiple(2, 6) * 100, currency: "GP" },
            { value: rollMultiple(2, 6) * 10, currency: "PP" }
          );
        }
      } else {
        coins.push(
          { value: rollMultiple(4, 6) * 1000, currency: "GP" },
          { value: rollMultiple(5, 6) * 100, currency: "PP" }
        );
      }
    } else {
      if (!hoard) {
        if (roll <= 15) {
          coins.push(
            { value: rollMultiple(2, 6) * 1000, currency: "EP" },
            { value: rollMultiple(8, 6) * 100, currency: "GP" }
          );
        } else if (roll <= 55) {
          coins.push(
            { value: rollMultiple(1, 6) * 1000, currency: "GP" },
            { value: rollMultiple(1, 6) * 100, currency: "PP" }
          );
        } else {
          coins.push(
            { value: rollMultiple(1, 6) * 1000, currency: "GP" },
            { value: rollMultiple(2, 6) * 100, currency: "PP" }
          );
        }
      } else {
        coins.push(
          { value: rollMultiple(12, 6) * 1000, currency: "GP" },
          { value: rollMultiple(8, 6) * 1000, currency: "PP" }
        );
      }
    }

    return coins;
  };

  const formatCoins = (coins) =>
    coins
      .filter((c) => c.value > 0)
      .map((c) => `${c.value} ${c.currency}`)
      .join(", ")
      .replace(/,([^,]*)$/, " &$1");

  const rollGold = () => {
    const roll = rollD100();
    const coins = determineLoot(level, hoard, roll);
    setRollResult(formatCoins(coins));
    setShowLink(true);
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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">GP LOTTERY</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="flex flex-col items-center space-y-1">
          <h2 className="font-tiamat text-3xl text-center">
            {rollResult ? rollResult : `Select ${hoard ? "Party" : "Player"} Level`}
          </h2>
          {showLink && (
            <a
              href="https://www.dndbeyond.com/sources/dnd/free-rules/equipment#Coins"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red active:text-activered underline"
            >
              View Conversion Chart
            </a>
          )}
        </div>

        <div className="flex space-x-4">
          <div>
            <label htmlFor="level-selector" className="me-1">{hoard ? "Party" : "Player"} Level:</label>
            <select
              name="level-selector"
              id="level-selector"
              className="py-1 bg-gray-100 text-center text-black"
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <label htmlFor="hoard-check">Treasure Hoard:</label>
            <input
              type="checkbox"
              name="hoard-check"
              id="hoard-check"
              className="accent-red"
              checked={hoard}
              onChange={(e) => setHoard(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={rollGold}
      >
        Roll!
      </button>
    </div>
  );
};
