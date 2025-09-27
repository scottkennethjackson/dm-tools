"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DeckOfManyThings() {
  const router = useRouter();
  const [deck, setDeck] = useState([]);
  const [deckType, setDeckType] = useState("balanced");
  const [rollResult, setRollResult] = useState(null);

  useEffect(() => {
    fetch("/json/cards.json")
      .then((res) => res.json())
      .then((data) => setDeck(data))
      .catch((err) => console.error("Error loading deck:", err));
  }, []);

  const getBalancedCard = (roll) => {
    if (roll >= 1 && roll <= 8) return "Euryale";
    if (roll >= 9 && roll <= 16) return "Flames";
    if (roll >= 17 && roll <= 24) return "Jester";
    if (roll >= 25 && roll <= 32) return "Key";
    if (roll >= 33 && roll <= 40) return "Knight";
    if (roll >= 41 && roll <= 48) return "Moon";
    if (roll >= 49 && roll <= 56) return "Rogue";
    if (roll >= 57 && roll <= 64) return "Ruin";
    if (roll >= 65 && roll <= 72) return "Skull";
    if (roll >= 73 && roll <= 80) return "Star";
    if (roll >= 81 && roll <= 88) return "Sun";
    if (roll >= 89 && roll <= 96) return "Throne";
    if (roll >= 97 && roll <= 100) return "Void";
  };

  const getChaoticCard = (roll) => {
    if (roll >= 1 && roll <= 5) return "Balance";
    if (roll >= 6 && roll <= 10) return "Comet";
    if (roll >= 11 && roll <= 14) return "Donjon";
    if (roll >= 15 && roll <= 18) return "Euryale";
    if (roll >= 19 && roll <= 23) return "Fates";
    if (roll >= 24 && roll <= 27) return "Flames";
    if (roll >= 28 && roll <= 31) return "Fool";
    if (roll >= 32 && roll <= 36) return "Gem";
    if (roll >= 37 && roll <= 41) return "Jester";
    if (roll >= 42 && roll <= 46) return "Key";
    if (roll >= 47 && roll <= 51) return "Knight";
    if (roll >= 52 && roll <= 56) return "Moon";
    if (roll >= 57 && roll <= 60) return "Puzzle";
    if (roll >= 61 && roll <= 64) return "Rogue";
    if (roll >= 65 && roll <= 68) return "Ruin";
    if (roll >= 69 && roll <= 73) return "Sage";
    if (roll >= 74 && roll <= 77) return "Skull";
    if (roll >= 78 && roll <= 82) return "Star";
    if (roll >= 83 && roll <= 87) return "Sun";
    if (roll >= 88 && roll <= 91) return "Talons";
    if (roll >= 92 && roll <= 96) return "Throne";
    if (roll >= 97 && roll <= 100) return "Void";
  };

  const drawCard = () => {
    if (!deck.length) {
      setRollResult({ title: "Deck Not Loaded", description: "Please try again." });
      return;
    }

    const roll = Math.ceil(Math.random() * 100);
    const selectedName =
      deckType === "balanced" ? getBalancedCard(roll) : getChaoticCard(roll);

    const card = deck.find((c) => c.card === selectedName);

    if (card) {
      let linkText = "Learn More";
      if (card.card === "Knight" || card.card === "Skull") linkText = "View Statblock";
      else if (card.card === "Moon") linkText = "View Spell";

      setRollResult({
        title: card.card,
        description: card.description,
        link: card.link || null,
        linkText,
      });
    } else {
      setRollResult({
        title: "No Card Found",
        description: `No matching card found for roll ${roll}.`,
        link: null,
      });
    }
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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">DECK OF MANY THINGS</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="flex flex-col items-center space-y-1">
          <h2 className="font-tiamat text-3xl text-center">
            {rollResult ? rollResult.title : "Select Deck Type"}
          </h2>
          {rollResult && (
            <>
              <p className="text-justify">{rollResult.description}</p>
              {rollResult.link && (
                <a
                  href={rollResult.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red active:text-activered underline"
                >
                  {rollResult.linkText}
                </a>
              )}
            </>
          )}
        </div>

        <div className="space-x-4">
          <label className="space-x-1">
            <input
              type="radio"
              name="deck"
              value="balanced"
              className="accent-red"
              checked={deckType === "balanced"}
              onChange={() => setDeckType("balanced")}
            />
            <span>Balanced</span>
          </label>

          <label className="space-x-1">
            <input
              type="radio"
              name="deck"
              value="chaotic"
              className="accent-red"
              checked={deckType === "chaotic"}
              onChange={() => setDeckType("chaotic")}

            />
            <span>Chaotic</span>
          </label>
        </div>
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={drawCard}
      >
        Roll!
      </button>
    </div>
  );
};
