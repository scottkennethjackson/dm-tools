"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function InitiativeTracker() {
  const router = useRouter();

  const [stage, setStage] = useState(1); // 1 = add combatants, 2 = enter initiative, 3 = resolve ties
  const [combatants, setCombatants] = useState([
    { id: crypto.randomUUID(), name: "", initiative: "" },
    { id: crypto.randomUUID(), name: "", initiative: "" },
  ]);
  const [duplicates, setDuplicates] = useState([]); 

  const handleAdd = () => {
    setCombatants((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", initiative: "" },
    ]);
  };

  const handleRemove = () => {
    setCombatants((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev));
  };

  const handleNameChange = (id, value) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );
  };

  const handleInitChange = (id, value) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, initiative: value } : c))
    );
  };
  
  const sortByInitiative = (list) => {
    return [...list].sort((a, b) => {
      const ai = parseInt(a.initiative, 10) || 0;
      const bi = parseInt(b.initiative, 10) || 0;
      return bi - ai;
    });
  };
  
  const handleStartCombat = () => {
    // 1. ensure unnamed combatants get default names
    const namedCombatants = combatants.map((c, idx) => ({
        ...c,
        name: c.name || `Combatant #${idx + 1}`,
    }));

    // 2. sort combatants
    let sorted = sortByInitiative(namedCombatants);
  
    // 3. find duplicate initiatives
    const duplicatesMap = new Map();
    sorted.forEach((c) => {
      const val = parseInt(c.initiative, 10) || 0;
      if (!duplicatesMap.has(val)) duplicatesMap.set(val, []);
      duplicatesMap.get(val).push(c);
    });
  
    const duplicateGroups = Array.from(duplicatesMap.values()).filter(
      (group) => group.length > 1
    );
  
    if (duplicateGroups.length > 0) {
      setDuplicates(duplicateGroups);
      setCombatants(sorted);
      setStage(3);
      return;
    }
  
    // 4. check natural 20s
    const nat20s = sorted.filter((c) => parseInt(c.initiative, 10) === 20);
    if (nat20s.length > 0) {
      setNat20Queue(nat20s);
      setCombatants(sorted);
      setStage(4);
      return;
    }
  
    // 5. otherwise, go straight to tracker
    setCombatants(sorted);
    setStage(5);
  };

  const handleResolveTies = () => {
    // merge DEX mods into combatants
    let updated = combatants.map((c) => {
      const dupe = duplicates.flat().find((d) => d.id === c.id);
      return dupe ? { ...c, dex: dupe.dex || 0 } : c;
    });
  
    // sort by initiative first, then dex
    updated = [...updated].sort((a, b) => {
      const ai = parseInt(a.initiative, 10) || 0;
      const bi = parseInt(b.initiative, 10) || 0;
      if (bi !== ai) return bi - ai;
      const ad = a.dex || 0;
      const bd = b.dex || 0;
      return bd - ad;
    });
  
    // check for nat20s after tie-break
    const nat20s = updated.filter((c) => parseInt(c.initiative, 10) === 20);
    if (nat20s.length > 0) {
      setNat20Queue(nat20s);
      setCombatants(updated);
      setStage(4);
      return;
    }
  
    // otherwise, go to tracker
    setCombatants(updated);
    setStage(5);
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
                    tied at {group[0].initiative}
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
    </div>
  );
}
