"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StatblockGenerator() {
  const router = useRouter();

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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">STATBLOCK GENERATOR</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-xl border-2 border-red">
        <h2 className="font-tiamat text-3xl text-center">Set NPC's Level</h2>

        <div className="hidden">{/* Character sheet goes here */}</div>
  
        <div className="bg-red">
          <div>
            <input
              type="radio"
              name="level"
              id="commoner-radio"
              className="accent-red"
              value="commoner"
              defaultChecked
            />
            <label className="text-grey" htmlFor="commoner-radio">
              Commoner
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="level"
              id="adventurer-radio"
              className="accent-red"
              value="adventurer"
            />
            <label className="text-grey" htmlFor="adventurer-radio">
              Adventurer
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="level"
              id="hero-radio"
              className="accent-red"
              value="hero"
            />
            <label className="text-grey" htmlFor="hero-radio">
              Hero
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="level"
              id="legend-radio"
              className="accent-red"
              value="legend"
            />
            <label className="text-grey" htmlFor="legend-radio">
              Legend
            </label>
          </div>
        </div>
  






        {/* modifiers */}
        <div className="relative w-full">
          <hr className="border-red" />
          <p className="absolute -top-3 left-1/2 -translate-x-1/2 font-serif text-sm italic text-gray-300 bg-black px-1">
            modifiers
          </p>
        </div>
  
        <div className="flex space-x-4">
          <select name="armor-selector" id="armor-selector" className="p-1 bg-gray-100 text-black">
            <option value="" disabled selected hidden>Armor Type</option>
            <option value="none">None</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
  
          <div className="flex items-center space-x-1">
            <input type="checkbox" name="armed-check" id="armed-check" className="accent-red" />
            <label htmlFor="armed-check">Armed</label>
          </div>
  
          <div className="flex items-center space-x-1">
            <input type="checkbox" name="spellcaster-check" id="spellcaster-check" className="accent-red" />
            <label htmlFor="spellcaster-check">Spellcaster</label>
          </div>
        </div>
      </div>

      <button className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer">
        Roll!
      </button>
    </div>
  );
}
