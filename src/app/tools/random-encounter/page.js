"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import pluralize from "pluralize";

export default function RandomEncounter() {
  const router = useRouter();

  const [monsters, setMonsters] = useState([]);
  const [partySize, setPartySize] = useState(4);
  const [partyLevel, setPartyLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("medium");
  const [encounter, setEncounter] = useState(null);
  const [loading, setLoading] = useState(true);

  const xpThresholds = {
    easy:   [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800],
    medium: [50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4200, 4900, 5700],
    hard:   [75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500],
    deadly: [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900, 12700]
  };

  useEffect(() => {
    fetch("/json/monsters.json")
      .then(res => res.json())
      .then(data => {
        setMonsters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load monsters:", err);
        setLoading(false);
      });
  }, []);

  function getXpBudget(size, level, diff) {
    const thresholds = xpThresholds[diff];
    if (!thresholds || level < 1 || level > thresholds.length) return 0;
    return thresholds[level - 1] * size;
  }

  function chooseEncounterType() {
    const roll = Math.floor(Math.random() * 4);
    return ["single", "duo", "mob", "horde"][roll];
  }

  function buildEncounter(size, level, diff) {
    const budget = getXpBudget(size, level, diff);
    const type = chooseEncounterType();

    if (!budget || monsters.length === 0) return null;

    if (type === "single") {
      const candidates = monsters.filter(m => m.xp <= budget * 1.2 && m.xp >= budget * 0.8);
      if (candidates.length === 0) return null;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      return [{ ...pick, count: 1 }];
    }

    if (type === "duo") {
      const half = budget / 2;
      const candidates = monsters.filter(m => m.xp <= half * 1.2 && m.xp >= half * 0.6);
      if (candidates.length === 0) return null;

      if (Math.random() < 0.5) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        return [{ ...pick, count: 2 }];
      } else {
        const a = candidates[Math.floor(Math.random() * candidates.length)];
        const b = candidates[Math.floor(Math.random() * candidates.length)];
        return [{ ...a, count: 1 }, { ...b, count: 1 }];
      }
    }

    if (type === "mob") {
      const bossBudget = budget * 0.75;
      const minionBudget = budget * 0.25;

      const bossCandidates = monsters.filter(m => m.xp <= bossBudget * 1.2 && m.xp >= bossBudget * 0.6);
      const minionCandidates = monsters.filter(m => m.xp <= minionBudget);

      if (bossCandidates.length === 0 || minionCandidates.length === 0) return null;

      const boss = bossCandidates[Math.floor(Math.random() * bossCandidates.length)];
      const minion = minionCandidates[Math.floor(Math.random() * minionCandidates.length)];
      const minionCount = Math.max(1, Math.floor(minionBudget / minion.xp));

      return [{ ...boss, count: 1 }, { ...minion, count: minionCount }];
    }

    if (type === "horde") {
      const minionCandidates = monsters.filter(m => m.xp <= budget / 10);
      if (minionCandidates.length === 0) return null;

      const minion = minionCandidates[Math.floor(Math.random() * minionCandidates.length)];
      const count = Math.max(4, Math.floor(budget / minion.xp));

      return [{ ...minion, count }];
    }

    return null;
  }

  function rollEncounter() {
    if (loading) return;
    const result = buildEncounter(partySize, partyLevel, difficulty);
    setEncounter(result);
  }

  function formatEncounter(encounter) {
    if (!encounter || encounter.length === 0) return "Roll to Generate Encounter";
  
    if (encounter.length === 1) {
      const m = encounter[0];
      return m.count === 1
        ? `${m.name} (CR ${m.cr})`
        : `${m.count} ${pluralize(m.name, m.count)} (CR ${m.cr})`;
    }
  
    if (encounter.length > 1) {
      return (
        <>
          {encounter.map((m, i) => {
            const part =
              m.count === 1
                ? `${m.name} (CR ${m.cr})`
                : `${m.count} ${pluralize(m.name, m.count)} (CR ${m.cr})`;
  
            return (
              <span key={i}>
                {i > 0 && <><br />& </>}
                {part}
              </span>
            );
          })}
        </>
      );
    }
  
    return "Encounter";
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
          alt="D&D" />
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">RANDOM ENCOUNTER</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <div className="text-center">
          <h2 className="font-tiamat text-3xl">
            {formatEncounter(encounter)}
          </h2>

          {encounter && encounter.length === 1 && (
            <div>
              <a
                href={encounter[0].link}
                target="_blank"
                rel="noopener noreferrer"
              className="hover:text-red active:text-activered underline"
              >
                View Statblock
              </a>
            </div>
          )}
          
          {encounter && encounter.length === 2 && encounter[0].name !== encounter[1].name && (
            <div>
              View Statblocks:{" "}
              <a
                href={encounter[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red active:text-activered underline"
              >
                {encounter[0].name}
              </a>
              {" "}/{" "}
              <a
                href={encounter[1].link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red active:text-activered underline"
              >
                {encounter[1].name}
              </a>
            </div>
          )}
          
          {encounter && encounter.length === 2 && encounter[0].name === encounter[1].name && (
            <div>
              <a
                href={encounter[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red active:text-activered underline"
              >
                View Statblock
              </a>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex justify-around mx-auto mb-5 max-w-80">
            <label className="space-x-1">
              <span>Party Size:</span>
              <input
                type="number"
                min="1"
                max="99"
                value={partySize}
                onChange={e => setPartySize(Number(e.target.value))}
                className="py-1 bg-gray-100 text-center text-black"
              />
            </label>

            <label className="space-x-1">
              <span>Party Level:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={partyLevel}
                onChange={e => setPartyLevel(Number(e.target.value))}
              className="py-1 bg-gray-100 text-center text-black"
              />
            </label>
          </div>

          <div className="relative mb-3">
            <hr className="border-red"></hr>
            <h3 className="absolute -top-3 left-1/2 -translate-x-1/2 px-1 font-serif text-sm text-gray-300 italic bg-black">difficulty</h3>
          </div>

          <div className="flex justify-around mx-auto max-w-80">
            <label className="space-x-1">
              <input
                type="radio"
                name="difficulty"
                value="easy"
                className="accent-red"
                checked={difficulty === "easy"}
                onChange={() => setDifficulty("easy")}
              />
              <span>Easy</span>
            </label>
            <label className="space-x-1">
              <input
                type="radio"
                name="difficulty"
                value="medium"
                className="accent-red"
                checked={difficulty === "medium"}
                onChange={() => setDifficulty("medium")}
              />
              <span>Medium</span>
            </label>
            <label className="space-x-1">
              <input
                type="radio"
                name="difficulty"
                value="hard"
                className="accent-red"
                checked={difficulty === "hard"}
                onChange={() => setDifficulty("hard")}
              />
              <span>Hard</span>
            </label>
              <label className="space-x-1">
              <input
                type="radio"
                name="difficulty"
                value="deadly"
                className="accent-red"
                checked={difficulty === "deadly"}
                onChange={() => setDifficulty("deadly")}
              />
              <span>Deadly</span>
            </label>
          </div>
        </div>
      </div>

      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={rollEncounter}
      >
        Roll!
      </button>
    </div>
  );
}
