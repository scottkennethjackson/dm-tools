const title = document.getElementById("title");
const commoner = document.getElementById("commoner-radio");
const adventurer = document.getElementById("adventurer-radio");
const hero = document.getElementById("hero-radio");
const traits = document.getElementById("traits");

let importedName = localStorage.getItem("generatedName");
let names = { male: [], female: [], surname: [] };
let speciesData = {};
let currentSpecies = null;
let currentSubspecies = null;
let npcModifiers = {};
let proficiencyData = {};
let proficiencyBonus = 2;
let baseHP = 8;
let levelMultiplier = 1;
let armorData = {};
let weaponsData = {};
let spellsData = {};

window.addEventListener("DOMContentLoaded", () => {
  title.innerText = importedName
    ? `Set ${importedName}'s Level`
    : "Set NPC's Level";
});

Promise.all([
  fetch("../json/names.json").then((res) => {
    if (!res.ok) throw new Error("Failed to load names.json");
    return res.json();
  }),
  fetch("../json/species.json").then((res) => {
    if (!res.ok) throw new Error("Failed to load species.json");
    return res.json();
  }),
  fetch("../json/proficiencies.json").then((res) => {
    if (!res.ok) throw new Error("Failed to load proficiencies.json");
    return res.json();
  }),
  fetch("../json/armor.json").then((res) => {
    if (!res.ok) throw new Error("Failed to load armor.json");
    return res.json();
  }),
  fetch("../json/weapons.json").then((res) => {
    if (!res.ok) throw new Error("Failed to load weapons.json");
    return res.json();
  }),
  fetch("../json/spells.json").then((res) => {
    if (!res.ok) throw new Error("Failed to load spells.json");
    return res.json();
  }),
])
  .then(
    ([
      namesData,
      speciesJson,
      proficienciesJson,
      armorJson,
      weaponsJson,
      spellsJson,
    ]) => {
      names.male = namesData["first names"]?.male.map((obj) => obj.name) || [];
      names.female =
        namesData["first names"]?.female.map((obj) => obj.name) || [];
      names.surname = namesData.surnames?.map((obj) => obj.name) || [];

      for (const speciesInfo of Object.values(speciesJson)) {
        let coreLangs = "";
        let additionalLang = [];

        if (Array.isArray(speciesInfo.languages)) {
          for (const entry of speciesInfo.languages) {
            if (entry["core languages"]) coreLangs = entry["core languages"];
            if (entry["additional language"]) {
              additionalLang = entry["additional language"].map(
                (l) => l.language
              );
            }
          }
        } else if (typeof speciesInfo.languages === "object") {
          coreLangs = speciesInfo.languages["core languages"] ?? "";
          additionalLang =
            speciesInfo.languages["additional language"]?.map(
              (l) => l.language
            ) ?? [];
        }

        speciesInfo._coreLanguages = coreLangs;
        speciesInfo._additionalLanguage = additionalLang;
      }

      speciesData = speciesJson;
      proficiencyData = proficienciesJson;
      armorData = armorJson;
      weaponsData = weaponsJson;
      speciesData = speciesJson;
      spellsData = spellsJson;
    }
  )
  .catch((error) => {
    console.error("Error loading JSON files:", error);
  });

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function rollName() {
  const nameInput = document.getElementById("name-input");

  if (importedName) {
    nameInput.value = importedName;
    localStorage.removeItem("generatedName");
    importedName = undefined;
  } else {
    const isMale = Math.random() < 0.5;
    const firstName = getRandom(isMale ? names.male : names.female);
    const surname = getRandom(names.surname);
    nameInput.value = `${firstName} ${surname}`;
  }
}

function rollLevel() {
  const getLevel = (multiplier, offset = 0) =>
    Math.ceil(Math.random() * multiplier) + offset;

  const getBaseHP = (rolls, offset = 0) =>
    Array.from({ length: rolls }, () => Math.ceil(Math.random() * 8)).reduce(
      (sum, roll) => sum + roll,
      offset
    );

  const npcTypes = {
    commoner: { level: () => getLevel(4), hp: () => getBaseHP(3, 8) },
    adventurer: { level: () => getLevel(6, 4), hp: () => getBaseHP(6, 23) },
    hero: { level: () => getLevel(6, 10), hp: () => getBaseHP(5, 53) },
    legend: { level: () => getLevel(4, 16), hp: () => getBaseHP(4, 83) },
  };

  let npcCategory = "legend";

  if (commoner.checked) npcCategory = "commoner";
  else if (adventurer.checked) npcCategory = "adventurer";
  else if (hero.checked) npcCategory = "hero";

  const { level, hp } = {
    level: npcTypes[npcCategory].level(),
    hp: npcTypes[npcCategory].hp(),
  };

  baseHP = hp;
  levelMultiplier = level;

  proficiencyBonus =
    level >= 17 ? 6 : level >= 13 ? 5 : level >= 9 ? 4 : level >= 5 ? 3 : 2;

  document.querySelectorAll(".proficiency-bonus").forEach((instance) => {
    instance.textContent = proficiencyBonus;
  });
}

function rollStats() {
  const rollD20 = () => Math.ceil(Math.random() * 20);

  const statIds = {
    STR: { stat: "str", modifier: "str-modifier" },
    DEX: { stat: "dex", modifier: "dex-modifier" },
    CON: { stat: "con", modifier: "con-modifier" },
    INT: { stat: "int", modifier: "int-modifier" },
    WIS: { stat: "wis", modifier: "wis-modifier" },
    CHA: { stat: "cha", modifier: "cha-modifier" },
  };

  const calculateStat = (statKey) => {
    let roll = rollD20();

    if (roll < 8) roll = 8;
    if (commoner.checked && roll > 14) roll = 14;
    else if (adventurer.checked && roll > 16) roll = 16;
    else if (hero.checked && roll > 18) roll = 18;

    const modifierValue = Math.floor((roll - 10) / 2);
    const modifierText = (modifierValue >= 0 ? "+" : "") + modifierValue;

    const { stat, modifier: modifierId } = statIds[statKey];
    const statElement = document.getElementById(stat);
    const modifierElement = document.getElementById(modifierId);

    if (statElement) statElement.textContent = roll;
    if (modifierElement) modifierElement.textContent = modifierText;

    npcModifiers[statKey] = modifierValue;
  };

  Object.keys(statIds).forEach((statKey) => {
    calculateStat(statKey);
  });

  document.getElementById("hp").textContent =
    baseHP + npcModifiers.CON * levelMultiplier;
}

function getSpells() {
  const spellcasting = document.getElementById("spellcasting");

  if (!document.getElementById("spellcaster-check").checked) {
    spellcasting.classList.add("hidden");
  } else {
    traits.classList.remove("hidden");
    spellcasting.classList.remove("hidden");

    const nth = document.getElementById("nth");
    const spellcastingLevel = document.getElementById("spellcasting-level");

    if (levelMultiplier === 1) {
      nth.textContent = "st";
    } else if (levelMultiplier === 2) {
      nth.textContent = "nd";
    } else if (levelMultiplier === 3) {
      nth.textContent = "rd";
    } else {
      nth.textContent = "th";
    }

    if (
      levelMultiplier === 8 ||
      levelMultiplier === 11 ||
      levelMultiplier === 18
    ) {
      spellcastingLevel.textContent = `an ${levelMultiplier}`;
    } else {
      spellcastingLevel.textContent = `a ${levelMultiplier}`;
    }

    const spellcastingAbility = document.getElementById("spellcasting-ability");
    const spellSave = document.getElementById("spell-save");
    const spellToHit = document.getElementById("spell-to-hit");

    if (
      npcModifiers.CHA > npcModifiers.WIS &&
      npcModifiers.CHA > npcModifiers.INT
    ) {
      spellcastingAbility.textContent = "Charisma";
      spellSave.textContent = 8 + npcModifiers.CHA + proficiencyBonus;
      spellToHit.textContent = npcModifiers.CHA + proficiencyBonus;
    } else if (npcModifiers.WIS > npcModifiers.INT) {
      spellcastingAbility.textContent = "Wisdom";
      spellSave.textContent = 8 + npcModifiers.WIS + proficiencyBonus;
      spellToHit.textContent = npcModifiers.WIS + proficiencyBonus;
    } else {
      spellcastingAbility.textContent = "Intelligence";
      spellSave.textContent = 8 + npcModifiers.INT + proficiencyBonus;
      spellToHit.textContent = npcModifiers.INT + proficiencyBonus;
    }

    const spellLink = (spellName) => {
      const spell = spellsData.find((spell) => spell.name === spellName);
      if (spell) {
        return `<a href="${spell.link}" class="hover:text-red active:brightness-90 underline" target="_blank">${spell.name}</a>`;
      } else {
        return spellName;
      }
    };

    const spellSlots = {
      1: { 1: [2, [firstLevel1]] },
      2: { 1: [3, [firstLevel1]] },
      3: { 1: [4, [firstLevel1]], 2: [2, [secondLevel1]] },
      4: { 1: [4, [firstLevel1, firstLevel2]], 2: [3, [secondLevel1]] },
      5: {
        1: [4, [firstLevel1, firstLevel2]],
        2: [3, [secondLevel1]],
        3: [2, [thirdLevel1]],
      },
      6: {
        1: [4, [firstLevel1, firstLevel2]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1]],
      },
      7: {
        1: [4, [firstLevel1, firstLevel2]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1]],
        4: [1, [fourthLevel1]],
      },
      8: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1]],
        4: [2, [fourthLevel1]],
      },
      9: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1]],
        4: [3, [fourthLevel1]],
        5: [1, [fifthLevel1]],
      },
      10: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
      },
      11: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
      },
      12: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
      },
      13: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
        7: [1, [seventhLevel]],
      },
      14: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
        7: [1, [seventhLevel]],
      },
      15: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
        7: [1, [seventhLevel]],
        8: [1, [eigthLevel]],
      },
      16: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
        7: [1, [seventhLevel]],
        8: [1, [eigthLevel]],
      },
      17: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2]],
        4: [3, [fourthLevel1, fourthLevel2]],
        5: [2, [fifthLevel1]],
        6: [1, [sixthLevel]],
        7: [1, [seventhLevel]],
        8: [1, [eigthLevel]],
        9: [1, [ninthLevel]],
      },
      18: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2, thirdLevel3]],
        4: [3, [fourthLevel1, fourthLevel2]],
        5: [3, [fifthLevel1]],
        6: [1, [sixthLevel]],
        7: [1, [seventhLevel]],
        8: [1, [eigthLevel]],
        9: [1, [ninthLevel]],
      },
      19: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2, thirdLevel3]],
        4: [3, [fourthLevel1, fourthLevel2, fourthLevel3]],
        5: [3, [fifthLevel1]],
        6: [2, [sixthLevel]],
        7: [1, [seventhLevel]],
        8: [1, [eigthLevel]],
        9: [1, [ninthLevel]],
      },
      20: {
        1: [4, [firstLevel1, firstLevel2, firstLevel3, firstLevel4]],
        2: [3, [secondLevel1, secondLevel2, secondLevel3]],
        3: [3, [thirdLevel1, thirdLevel2, thirdLevel3]],
        4: [3, [fourthLevel1, fourthLevel2, fourthLevel3]],
        5: [3, [fifthLevel1, fifthLevel2]],
        6: [2, [sixthLevel]],
        7: [2, [seventhLevel]],
        8: [1, [eigthLevel]],
        9: [1, [ninthLevel]],
      },
    };

    const ordinal = (n) => {
      n = parseInt(n);
      if (n === 1) return "1st";
      if (n === 2) return "2nd";
      if (n === 3) return "3rd";
      return `${n}th`;
    };

    const generateSpells = (level) => {
      const cantrips = cantripsByLevel[Math.min(level, 10)] || [];
      let spellsHTML = `<p class="break-sm">Cantrips (at will): ${cantrips
        .map(spellLink)
        .join(", ")}</p>`;

      const spellLevels = spellSlots[level];
      if (spellLevels) {
        for (const [spellLevel, [slots, spellsList]] of Object.entries(
          spellLevels
        )) {
          spellsHTML += `<p class="break-sm">${ordinal(
            spellLevel
          )} level (${slots} slots): ${spellsList
            .map(spellLink)
            .join(", ")}</p>`;
        }
      }
      return spellsHTML;
    };

    // Example usage
    spells = generateSpells(levelMultiplier);
    console.log(spells);
  }
}

function rollNPC() {
  title.classList.add("hidden");
  document.getElementById("character-sheet").classList.remove("hidden");

  rollName();
  rollSpecies();
  rollAlignment();
  rollLevel();
  rollStats();
  rollProficiencies();
  rollArmor();
  getWeapons();
  getSpells();
}

document.getElementById("roll-btn").addEventListener("click", rollNPC);
