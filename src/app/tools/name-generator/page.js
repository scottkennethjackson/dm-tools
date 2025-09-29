"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NameGenerator() {
  const router = useRouter();

  const [names, setNames] = useState({ male: [], female: [], surname: [] });
  const [gender, setGender] = useState("male");
  const [generatedName, setGeneratedName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/json/names.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load names.json");
        return res.json();
      })
      .then((data) => {
        setNames({
          male: data["first names"]?.male || [],
          female: data["first names"]?.female || [],
          surname: data.surnames || [],
        });
      })
      .catch((err) => {
        console.error("Error loading names:", err);
        setError("Failed to Load Names");
      });
  }, []);

  const getRandomName = (list) => {
    if (!Array.isArray(list) || list.length === 0) return "Unknown";
    const index = Math.floor(Math.random() * list.length);
    return list[index].name || "Unnamed";
  };

  const rollName = () => {
    if (
      names.male.length === 0 &&
      names.female.length === 0 &&
      names.surname.length === 0
    ) {
      setGeneratedName("Names not loaded. Please try again in a moment.");
      return;
    }

    let firstName = "Unnamed";

    if (gender === "male") {
      firstName = getRandomName(names.male);
    } else if (gender === "female") {
      firstName = getRandomName(names.female);
    } else {
      setGeneratedName("Please select a gender");
      return;
    }

    const surname = getRandomName(names.surname);
    const fullName = `${firstName} ${surname}`;

    setGeneratedName(fullName);
    localStorage.setItem("generatedName", fullName);
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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">NAME GENERATOR</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="flex flex-col items-center space-y-1">
          <h2 className="font-tiamat text-3xl text-center">
            {error || generatedName || "Roll to Generate Name"}
          </h2>
  
          {generatedName && (
            <a
              href="/statblock-generator"
              className="hover:text-red active:text-activered underline"
            >
              Generate Statblock
            </a>
          )}
        </div>
  
        <div className="flex space-x-4">
          <label className="space-x-1">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={() => setGender("male")}
              className="accent-red"
            />
            <span>Masculine</span>
          </label>
          <label className="space-x-1">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={() => setGender("female")}
              className="accent-red"
            />
            <span>Feminine</span>
          </label>
        </div>
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={rollName}
      >
        Roll!
      </button>
    </div>
  );
}
