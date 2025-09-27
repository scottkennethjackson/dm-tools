"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function InitiativeTracker() {
  const router = useRouter();

  const defaultCombatant = () => ({
    id: crypto.randomUUID(),
    name: "",
    initiative: "",
    hp: "",
    ac: "",
    conditions: [],
    deathSaves: [false, false, false],
  });

  const [stage, setStage] = useState(1); // 1 = add combatants, 2 = enter initiative, 3 = resolve ties, 4 = handle nat 20s, 5 = tracker
  const [combatants, setCombatants] = useState([defaultCombatant(), defaultCombatant()]);
  const [duplicates, setDuplicates] = useState([]);
  const [nat20Queue, setNat20Queue] = useState([]);
  const [natIndex, setNatIndex] = useState(0);
  const [takenPositions, setTakenPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [turnIndex, setTurnIndex] = useState(0);

  function sortByInitiative(list) {
    return [...list].sort((a, b) => {
      const ai = parseInt(a.initiative, 10) || 0;
      const bi = parseInt(b.initiative, 10) || 0;
      return bi - ai;
    });
  };

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
  }

  const ensureDefaults = (c) => ({
    hp: "",
    ac: "",
    conditions: [],
    deathSaves: [false, false, false],
    ...c,
  });

  const handleAdd = () => {
    setCombatants((prev) => [...prev, defaultCombatant()]);
  };

  const handleRemove = () => {
    setCombatants((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev));
  };

  const handleNameChange = (id, value) => {
    setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, name: value } : c)));
  };

  const handleInitChange = (id, value) => {
    setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, initiative: value } : c)));
  };
  
  const handleStartCombat = () => {
    const namedCombatants = combatants.map((c, idx) => ({
        ...c,
        name: c.name || `Combatant #${idx + 1}`,
    }));
    let sorted = sortByInitiative(namedCombatants).map(ensureDefaults);
  
    const duplicatesMap = new Map();
    sorted.forEach((c) => {
      const val = parseInt(c.initiative, 10) || 0;
      if (!duplicatesMap.has(val)) duplicatesMap.set(val, []);
      duplicatesMap.get(val).push(c);
    });
  
    const duplicateGroups = Array.from(duplicatesMap.values()).filter((group) => group.length > 1);
  
    if (duplicateGroups.length > 0) {
      setDuplicates(duplicateGroups);
      setCombatants(sorted);
      setStage(3);
      return;
    }
  
    const nat20s = sorted.filter((c) => parseInt(c.initiative, 10) === 20);
    if (nat20s.length > 0) {
      setNat20Queue(nat20s);
      setNatIndex(0);
      setTakenPositions([]);
      setSelectedPosition(null);
      setCombatants(sorted);
      setTurnIndex(0);
      setStage(4);
      return;
    }
  
    setCombatants(sorted);
    setTurnIndex(0);
    setStage(5);
  };

  const handleResolveTies = () => {
    let updated = combatants.map((c) => {
      const dupe = duplicates.flat().find((d) => d.id === c.id);
      return dupe ? { ...c, dex: dupe.dex || 0 } : c;
    });
  
    updated = [...updated].sort((a, b) => {
      const ai = parseInt(a.initiative, 10) || 0;
      const bi = parseInt(b.initiative, 10) || 0;
      if (bi !== ai) return bi - ai;
      const ad = a.dex || 0;
      const bd = b.dex || 0;
      return bd - ad;
    }).map(ensureDefaults);
  
    const nat20s = updated.filter((c) => parseInt(c.initiative, 10) === 20);
    if (nat20s.length > 0) {
      setNat20Queue(nat20s);
      setNatIndex(0);
      setTakenPositions([]);
      setSelectedPosition(null);
      setCombatants(updated);
      setTurnIndex(0);
      setStage(4);
      return;
    }
  
    setCombatants(updated);
    setTurnIndex(0);
    setStage(5);
  };

  const handleNatNo = () => {
    if (natIndex < nat20Queue.length - 1) {
      setNatIndex((i) => i + 1);
      setSelectedPosition(null);
    } else {
      setNat20Queue([]);
      setNatIndex(0);
      setTakenPositions([]);
      setSelectedPosition(null);
      setTurnIndex(0);
      setStage(5);
    }
  };

  const handleNatYes = () => {
    const current = nat20Queue[natIndex];
    if (!current) return;
    if (selectedPosition == null) {
      alert("Please select a combat position.");
      return;
    }

    setCombatants((prev) => {
      const copy = prev.map((c) => ({ ...c }));
      const idx = copy.findIndex((c) => c.id === current.id);
      if (idx !== -1) copy.splice(idx, 1);
      const pos = Number(selectedPosition);
      copy.splice(pos, 0, ensureDefaults(current));

      setTakenPositions((tp) => [...tp, pos]);

      if (natIndex < nat20Queue.length - 1) {
        setNatIndex((i) => i + 1);
        setSelectedPosition(null);
        return copy;
      } else {
        setTimeout(() => {
          setNat20Queue([]);
          setNatIndex(0);
          setSelectedPosition(null);
          setTurnIndex(pos); // focus the chosen position
          setStage(5);
        }, 0);
        return copy;
      }
    });
  };

  const handleStatChange = (id, field, value) => {
    setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  
  const handleAddCondition = (id, condition) => {
    setCombatants(prev =>
      prev.map((c) => (c.id === id ? { ...c, conditions: [...(c.conditions || []), condition] } : c))
    );
  };
  
  const handleRemoveCondition = (id, condition) => {
    setCombatants(prev =>
      prev.map((c) => (c.id === id ? { ...c, conditions: c.conditions.filter(cond => cond !== condition) }: c))
    );
  };

  const handleNextTurn = () => {
    setTurnIndex((i) => (combatants.length ? (i + 1) % combatants.length : 0));
  };
  
  const handlePrevTurn = () => {
    setTurnIndex((i) => (combatants.length ? (i - 1 + combatants.length) % combatants.length: 0));
  };

  const handleDeathSaveToggle = (id, index) => {
    setCombatants((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== id) return c;
        const ds = [...(c.deathSaves || [false, false, false])];
        ds[index] = !ds[index];
        return { ...c, deathSaves: ds };
      });

      const died = updated.find((c) => c.id === id && (c.deathSaves || []).every(Boolean));
      if (died) {
        const filtered = updated.filter((c) => c.id !== id);

        if (filtered.length === 0) {
          setTimeout(() => handleReset(), 0);
          return updated;
        } else {
          setTurnIndex((t) => Math.min(t, filtered.length - 1));
          return filtered;
        }
      }

      return updated;
    });
  };

  const handleReset = () => {
    setStage(1);
    setCombatants([defaultCombatant(), defaultCombatant()]);
    setDuplicates([]);
    setNat20Queue([]);
    setNatIndex(0);
    setTakenPositions([]);
    setSelectedPosition(null);
    setTurnIndex(0);
  };

  const currentCombatant = combatants.length ? combatants[Math.min(turnIndex, combatants.length - 1)] : null;

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
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">INITIATIVE TRACKER</h1>
      </div>

      {/* Stage 1: Add Combatants */}
      {stage === 1 && (
        <>
          <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
            <h2 className="font-roboto text-lg font-bold uppercase">Add Combatants</h2>
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
              <button
                onClick={handleRemove}
                disabled={combatants.length <= 2}
                className={`rounded-full ${
                  combatants.length > 2
                    ? "bg-red active:bg-activered cursor-pointer"
                    : "bg-gray-500 cursor-not-allowed"
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
            </div>
          </div>

          <button
            className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
            onClick={() => setStage(2)}
          >
            Next
          </button>
        </>
      )}

      {/* Stage 2: Enter Initiative */}
      {stage === 2 && (
        <>
          <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
            <h2 className="font-roboto text-lg font-bold uppercase">Enter Initiative</h2>
            <div className="flex flex-col space-y-2 min-w-64 max-w-full">
              {combatants.map((combatant, index) => (
                <div
                  key={combatant.id}
                  className="flex justify-between space-x-2"
                >
                  <span className="font-tiamat text-2xl truncate">{combatant.name || `Combatant #${index + 1}`}</span>
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

          <button
            className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
            onClick={handleStartCombat}
          >
            Go!
          </button>
        </>
      )}

      {/* Stage 3: Resolve Ties */}
      {stage === 3 && (
        <>
          <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
            <h2 className="font-roboto text-lg font-bold uppercase">Enter DEX Scores</h2>
            {duplicates.map((group, idx) => (
              <div key={idx} className="flex flex-col space-y-2 min-w-64 max-w-full">
                <div className="relative">
                  <hr className="border-red"></hr>
                  <h3 className="absolute -top-3 left-1/2 -translate-x-1/2 px-1 font-serif text-sm text-gray-300 italic bg-black">
                    tied at {group[0].initiative || 1}
                  </h3>
                </div>
                {group.map((c) => (
                  <div key={c.id} className="flex justify-between space-x-2">
                    <span className="font-tiamat text-2xl truncate">
                      {c.name || "Unnamed Combatant"}
                    </span>
                    <input
                      type="number"
                      value={c.dex || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setDuplicates((prev) =>
                          prev.map((grp) =>
                            grp.map((x) =>
                              x.id === c.id ? { ...x, dex: val } : x
                            )
                          )
                        );
                      }}
                      className="p-1 w-16 text-center text-black bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <button
            className="p-2 w-32 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
            onClick={handleResolveTies}
          >
            Confirm
          </button>
        </>
      )}

      {/* Stage 4: Handle Nat 20s */}
      {stage === 4 && nat20Queue.length > 0 && (
        <>
          <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
            <h2 className="font-roboto text-lg font-bold uppercase">Was It a Natural 20?</h2>

            {(() => {
              const current = nat20Queue[natIndex];
              if (!current) return null;
              return (
                <>
                  <h3 className="font-tiamat text-2xl">{current.name}</h3>
                  <div className="space-x-1">
                    <label className="font-serif text-gray-300 italic">if so, select position:</label>
                    <select
                        aria-label="Choose position for natural 20"
                        value={selectedPosition ?? ""}
                        onChange={(e) => setSelectedPosition(e.target.value === "" ? null : Number(e.target.value))}
                        className="p-1 text-center text-black bg-gray-100"
                    >
                      {(() => {
                      const n = combatants.length;
                      const opts = [];
                      for (let i = 0; i < n; i++) {
                          if (!takenPositions.includes(i)) {
                          opts.push(i);
                          }
                      }
                      return opts.map((i) => (
                          <option key={i} value={i}>
                          {getOrdinal(i + 1)}
                          </option>
                      ));
                      })()}
                    </select>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="flex space-x-4">
            <button
              className="mt-2 p-2 w-14 font-tiamat text-lg bg-red active:bg-activered cursor-pointer"
              onClick={handleNatNo}
            >
              No
            </button>

            <div className="flex flex-col items-center">
              <button
                className="mt-2 p-2 w-14 font-tiamat text-lg bg-green-600 active:bg-green-700 cursor-pointer"
                onClick={handleNatYes}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}

      {/* STAGE 5 */}
      {stage === 5 && combatants.length > 0 && currentCombatant && (
        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCombatant.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center px-4 py-8 space-y-4 border-2 border-red w-full"
            >
              <h2 className="font-tiamat text-3xl text-center">{currentCombatant.name}</h2>
              
              <div className="flex space-x-4 min-w-64 max-w-80">
                <div className="flex flex-col space-y-1">
                  <div className="flex space-x-1">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="size-8 fill-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
                    </svg>
                    <input
                      type="number"
                      placeholder="HP"
                      value={currentCombatant.hp ?? ""}
                      onChange={(e) => handleStatChange(currentCombatant.id, "hp", e.target.value)}
                      className="py-1 w-12 font-roboto text-xl font-bold"
                    />
                  </div>
                  <div className="flex space-x-1">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="size-8 fill-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64z" />
                    </svg>
                    <input
                      type="number"
                      placeholder="AC"
                      value={currentCombatant.ac ?? ""}
                      onChange={(e) => handleStatChange(currentCombatant.id, "ac", e.target.value)}
                      className="py-1 w-12 font-roboto text-xl font-bold"
                    />
                  </div>
                </div>
  
                <div className="space-y-1">
                  <div className="flex items-center justify-between space-x-2 h-9.5">
                    <span className="font-serif text-gray-300 italic">death saves:</span>
                    <div className="flex space-x-2">
                      {(currentCombatant.deathSaves || [false, false, false]).map((checked, idx) => (
                      <label key={`${currentCombatant.id}-save-${idx}`} className="cursor-pointer">
                          <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleDeathSaveToggle(currentCombatant.id, idx)}
                          className="hidden peer"
                          />
                          <span
                          className={`
                              flex items-center justify-center size-6 border
                              ${checked ? "bg-red border-red" : "bg-gray-200 border-gray-300"}
                              peer-checked:bg-red
                          `}
                          >
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              className="size-10 fill-gray-300"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 -960 960 960"
                            >
                              <path d="M240-80v-170q-39-17-68.5-45.5t-50-64.5q-20.5-36-31-77T80-520q0-158 112-259t288-101q176 0 288 101t112 259q0 42-10.5 83t-31 77q-20.5 36-50 64.5T720-250v170H240Zm80-80h40v-80h80v80h80v-80h80v80h40v-142q38-9 67.5-30t50-50q20.5-29 31.5-64t11-74q0-125-88.5-202.5T480-800q-143 0-231.5 77.5T160-520q0 39 11 74t31.5 64q20.5 29 50.5 50t67 30v142Zm100-200h120l-60-120-60 120Zm-80-80q33 0 56.5-23.5T420-520q0-33-23.5-56.5T340-600q-33 0-56.5 23.5T260-520q0 33 23.5 56.5T340-440Zm280 0q33 0 56.5-23.5T700-520q0-33-23.5-56.5T620-600q-33 0-56.5 23.5T540-520q0 33 23.5 56.5T620-440ZM480-160Z" />
                            </svg>
                          </span>
                      </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <select
                      onChange={(e) => { if (e.target.value) { handleAddCondition(currentCombatant.id, e.target.value); e.target.value = ""; } }}
                      className="py-1 w-full min-w-48 font-roboto text-xl font-bold"
                    >
                      <option value="">CONDITION</option>
                      <option value="blinded">Blinded</option>
                      <option value="charmed">Charmed</option>
                      <option value="deafened">Deafened</option>
                      <option value="frightened">Frightened</option>
                      <option value="grappled">Grappled</option>
                      <option value="incapacitated">Incapacitated</option>
                      <option value="invisible">Invisible</option>
                      <option value="paralysed">Paralysed</option>
                      <option value="petrified">Petrified</option>
                      <option value="poisoned">Poisoned</option>
                      <option value="prone">Prone</option>
                      <option value="restrained">Restrained</option>
                      <option value="stunned">Stunned</option>
                      <option value="unconscious">Unconscious</option>
                    </select>
  
                    <div className="flex flex-wrap gap-0.5">
                      {(currentCombatant.conditions || []).map((cond) => (
                        <span
                          key={cond}
                          className="px-1 py-0.5 text-xs capitalize bg-red rounded cursor-pointer"
                          onClick={() => handleRemoveCondition(currentCombatant.id, cond)}
                        >
                          {cond} ✕
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 mt-2 w-full">
                <button
                  onClick={handlePrevTurn}
                  className="group flex justify-end items-center px-3.5 w-1/2 font-tiamat text-xl font-bold text-gray-400 hover:text-red active:text-activered cursor-pointer"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="size-6 fill-gray-400 group-hover:fill-red group-active:fill-activered"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleNextTurn}
                  className="group flex justify-start items-center px-3.5 w-1/2 font-tiamat text-xl font-bold text-gray-400 hover:text-red active:text-activered cursor-pointer"
                >
                  Next
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="size-6 fill-gray-400 group-hover:fill-red group-active:fill-activered"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex space-x-2">
            <button onClick={handleReset} className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer">Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
