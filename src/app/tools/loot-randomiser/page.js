"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LootRandomiser() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lootResult, setLootResult] = useState(null);

  const [trinkets, setTrinkets] = useState([]);
  const [gemstones, setGemstones] = useState([]);
  const [valuables, setValuables] = useState([]);
  const [consumables, setConsumables] = useState([]);

  const [cantrips, setCantrips] = useState([]);
  const [level1, setLevel1] = useState([]);
  const [level2, setLevel2] = useState([]);
  const [level3, setLevel3] = useState([]);
  const [level4, setLevel4] = useState([]);
  const [level5, setLevel5] = useState([]);
  const [level6, setLevel6] = useState([]);
  const [level7, setLevel7] = useState([]);
  const [level8, setLevel8] = useState([]);
  const [level9, setLevel9] = useState([]);

  const [cursed, setCursed] = useState([]);
  const [uncommon, setUncommon] = useState([]);
  const [rare, setRare] = useState([]);
  const [veryRare, setVeryRare] = useState([]);
  const [legendary, setLegendary] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/json/treasure.json").then((r) => r.json()),
      fetch("/json/consumables.json").then((r) => r.json()),
      fetch("/json/spells.json").then((r) => r.json()),
      fetch("/json/magic-items.json").then((r) => r.json()),
    ]).then(([treasure, consumableData, spells, magicItems]) => {
      setTrinkets(treasure.trinkets);
      setGemstones(treasure.gemstones);
      setValuables(treasure.valuables);
      setConsumables(consumableData);

      setCantrips(spells.cantrips);
      setLevel1(spells["1st level"]);
      setLevel2(spells["2nd level"]);
      setLevel3(spells["3rd level"]);
      setLevel4(spells["4th level"]);
      setLevel5(spells["5th level"]);
      setLevel6(spells["6th level"]);
      setLevel7(spells["7th level"]);
      setLevel8(spells["8th level"]);
      setLevel9(spells["9th level"]);

      setCursed(magicItems.cursed);
      setUncommon(magicItems.uncommon);
      setRare(magicItems.rare);
      setVeryRare(magicItems["very rare"]);
      setLegendary(magicItems.legendary);

      setDataLoaded(true);
    });
  }, []);

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const rollLoot = () => {
    if (!dataLoaded) return;
  
    const lootRoll = Math.floor(Math.random() * 8);
  
    const handlers = {
      0: () => ({ title: "You Didn't Find Anything" }),
      1: () => ({ title: randomPick(trinkets).name }),
      2: () => ({ title: randomPick(gemstones).name }),
      3: () => ({ title: randomPick(valuables).name }),
      4: () => {
        const pick = randomPick(consumables);
        return { title: pick.name, link: pick.link };
      },
      5: () => {
        const quantity = Math.ceil(Math.random() * 4);
        const title =
          quantity === 1 ? "Potion of Healing" : `${quantity} Potions of Healing`;
        return {
          title,
          link: "https://www.dndbeyond.com/magic-items/8960641-potion-of-healing",
        };
      },
      6: () => {
        const levelRoll = Math.floor(Math.random() * 10);
        const spellLists = [
          { list: cantrips, level: "Cantrip" },
          { list: level1, level: "1st Level" },
          { list: level2, level: "2nd Level" },
          { list: level3, level: "3rd Level" },
          { list: level4, level: "4th Level" },
          { list: level5, level: "5th Level" },
          { list: level6, level: "6th Level" },
          { list: level7, level: "7th Level" },
          { list: level8, level: "8th Level" },
          { list: level9, level: "9th Level" },
        ];
        const { list, level } = spellLists[levelRoll];
        const pick = randomPick(list);
        return { title: `Spell Scroll, ${level}: ${pick.name}`, link: pick.link };
      },
      7: () => {
        const rarityRoll = Math.floor(Math.random() * 31);
        const category =
          rarityRoll === 0
            ? cursed
            : rarityRoll <= 16
            ? uncommon
            : rarityRoll <= 25
            ? rare
            : rarityRoll <= 29
            ? veryRare
            : legendary;
        const pick = randomPick(category);
        return { title: pick.name, link: pick.link };
      },
    };
  
    setLootResult(handlers[lootRoll]());
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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">LOOT RANDOMISER</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <h2 className="font-tiamat text-3xl text-center">
          {lootResult?.title || "Roll to Generate Loot"}
        </h2>
          
        {lootResult?.link && (
          <a
            href={lootResult.link}
            target="_blank"
            rel="noopener noreferrer"
              className="hover:text-red active:text-activered underline"
          >
            View Item
          </a>
        )}
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={rollLoot}
      >
        Roll!
      </button>
    </div>
  );
}
