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

function rollSpecies() {
  const speciesList = [
    "Dragonborn",
    "Dwarf",
    "Elf",
    "Gnome",
    "Goliath",
    "Halfling",
    "Human",
    "Orc",
    "Tiefling",
  ];
  const species = getRandom(speciesList);
  const speciesInfo = speciesData[species];
  const npcSpecies = document.getElementById("species");

  if (!speciesInfo) {
    console.warn(`Species data for "${species}" not found.`);
    return;
  }

  document
    .querySelectorAll(".npc")
    .forEach((instance) => (instance.textContent = species));
  document.getElementById("size").textContent = speciesInfo.size || "";
  document.getElementById("shape").textContent =
    speciesInfo["creature type"] || "";

  let selectedSubspecies = null;

  if (species === "Goliath") {
    selectedSubspecies = getRandom(speciesInfo.subspecies);
    npcSpecies.textContent = species || "";
  } else if (
    Array.isArray(speciesInfo.subspecies) &&
    speciesInfo.subspecies.length > 0
  ) {
    selectedSubspecies = getRandom(speciesInfo.subspecies);
    npcSpecies.textContent = `${selectedSubspecies.type} ${species}` || "";
  } else {
    npcSpecies.textContent = species || "";
  }

  currentSpecies = species;
  currentSubspecies = selectedSubspecies;

  const speed = selectedSubspecies?.["improved speed"] ?? speciesInfo.speed;
  document.getElementById("speed").textContent = speed || "";

  const rangedAttack = document.getElementById("ranged-attack");
  const breathWeapon = document.getElementById("breath-weapon");
  const dmgResistances = document.getElementById("dmg-resistances");
  let resistance = "";

  if (species === "Dragonborn") {
    rangedAttack.classList.add("hidden");
    breathWeapon.classList.remove("hidden");
  } else {
    rangedAttack.classList.remove("hidden");
    breathWeapon.classList.add("hidden");
  }

  if (species === "Dragonborn") {
    const element = selectedSubspecies.element;

    dmgResistances.classList.remove("hidden");
    resistance = element;
    document
      .querySelectorAll(".breath-dmg-type")
      .forEach((instance) => (instance.textContent = element));
  } else if (species === "Tiefling") {
    dmgResistances.classList.remove("hidden");
    resistance = selectedSubspecies["damage resistance"];
  } else if (speciesInfo["damage resistance"]) {
    dmgResistances.classList.remove("hidden");
    resistance = speciesInfo["damage resistance"];
  } else {
    dmgResistances.classList.add("hidden");
  }

  document.getElementById("resistance").textContent = resistance || "";

  const darkvision = document.getElementById("darkvision");
  let darkvisionRange = 0;

  if (selectedSubspecies?.["improved darkvision"]) {
    darkvision.classList.remove("hidden");
    darkvisionRange = selectedSubspecies["improved darkvision"];
  } else if (speciesInfo.darkvision["has darkvision"]) {
    darkvision.classList.remove("hidden");
    darkvisionRange = speciesInfo.darkvision.range;
  } else {
    darkvision.classList.add("hidden");
  }

  document.getElementById("darkvision-range").textContent =
    darkvisionRange || "";

  let languages = "";

  const coreLangs =
    selectedSubspecies?.languages?.["core languages"] ??
    speciesInfo._coreLanguages;

  const rollAdditionalLang = (exclude = "") => {
    const additional = speciesInfo._additionalLanguage;

    if (!additional.length) return "";

    let result;

    do {
      result = additional[Math.floor(Math.random() * additional.length)];
    } while (result === exclude && additional.length > 1);
    return result;
  };

  if (selectedSubspecies?.type === "Chthonic") {
    languages = coreLangs;
  } else if (species === "Human") {
    const lang2 = rollAdditionalLang();
    const lang3 = rollAdditionalLang(lang2);

    if (lang2 && lang3) {
      languages = `${coreLangs}, ${lang2} & ${lang3}`;
    } else if (lang2) {
      languages = `${coreLangs} & ${lang2}`;
    } else {
      languages = coreLangs;
    }
  } else {
    const extraLang = rollAdditionalLang();
    languages = extraLang ? `${coreLangs} & ${extraLang}` : coreLangs;
  }

  document.getElementById("languages").textContent = languages || "";

  const mainTrait = document.getElementById("main-trait");
  const subTrait = document.getElementById("sub-trait");
  const additionalTraits = document.getElementById("additional-traits");

  const trait1 = document.getElementById("trait1");
  const trait1Description = document.getElementById("trait1-description");
  const trait2 = document.getElementById("trait2");
  const trait2Description = document.getElementById("trait2-description");
  const trait3 = document.getElementById("trait3");
  const trait3Description = document.getElementById("trait3-description");
  const trait4 = document.getElementById("trait4");
  const trait4Description = document.getElementById("trait4-description");

  if (species === "Halfling" && Array.isArray(speciesInfo?.traits)) {
    traits.classList.remove("hidden");
    mainTrait.classList.remove("hidden");
    subTrait.classList.remove("hidden");
    additionalTraits.classList.remove("hidden");

    const traitElements = [
      [trait1, trait1Description],
      [trait2, trait2Description],
      [trait3, trait3Description],
      [trait4, trait4Description],
    ];

    traitElements.forEach(([nameElement, descElement], index) => {
      const trait = speciesInfo.traits[index];
      nameElement.textContent = trait?.name || "";
      descElement.textContent = trait?.description || "";
    });
  } else if (species === "Goliath") {
    traits.classList.remove("hidden");
    mainTrait.classList.remove("hidden");
    subTrait.classList.remove("hidden");
    additionalTraits.classList.add("hidden");

    trait1.textContent = speciesInfo.traits.name || "";
    trait1Description.textContent = speciesInfo.traits.description || "";
    trait2.textContent = selectedSubspecies["subspecies trait"].name || "";
    trait2Description.textContent =
      selectedSubspecies["subspecies trait"].description || "";
  } else if (speciesInfo?.traits) {
    traits.classList.remove("hidden");
    mainTrait.classList.remove("hidden");
    subTrait.classList.add("hidden");
    additionalTraits.classList.add("hidden");

    trait1.textContent = speciesInfo.traits.name || "";
    trait1Description.textContent = speciesInfo.traits.description || "";
  } else {
    traits.classList.add("hidden");
    mainTrait.classList.add("hidden");
    subTrait.classList.add("hidden");
    additionalTraits.classList.add("hidden");
  }

  const bonusActions = document.getElementById("bonus-actions");

  if (speciesInfo?.["bonus action"]) {
    bonusActions.classList.remove("hidden");
    document.getElementById("bonus-name").textContent =
      speciesInfo["bonus action"].name || "";
    document.getElementById("bonus-description").innerHTML =
      speciesInfo["bonus action"].description || "";
  } else {
    bonusActions.classList.add("hidden");
  }
}

function rollAlignment() {
  const lawfulness = getRandom(["Chaotic", "Neutral", "Lawful"]);
  const goodness = getRandom(["Evil", "Neutral", "Good"]);

  document.getElementById("alignment").textContent =
    lawfulness === goodness
      ? "True Neutral"
      : `${lawfulness} ${goodness}` || "";
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
  const roll4d6DropLowest = () => {
    const rolls = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
    rolls.sort((a, b) => b - a);
    return rolls[0] + rolls[1] + rolls[2];
  };

  const statIds = {
    STR: { stat: "str", modifier: "str-modifier" },
    DEX: { stat: "dex", modifier: "dex-modifier" },
    CON: { stat: "con", modifier: "con-modifier" },
    INT: { stat: "int", modifier: "int-modifier" },
    WIS: { stat: "wis", modifier: "wis-modifier" },
    CHA: { stat: "cha", modifier: "cha-modifier" },
  };

  const rawStats = {};

  Object.keys(statIds).forEach((statKey) => {
    rawStats[statKey] = roll4d6DropLowest();
  });

  const getBoostCount = () => {
    if (levelMultiplier >= 19) return 5;
    if (levelMultiplier >= 16) return 4;
    if (levelMultiplier >= 12) return 3;
    if (levelMultiplier >= 8) return 2;
    if (levelMultiplier >= 4) return 1;
    return 0;
  };

  const boostCount = getBoostCount();

  const sortedStats = Object.entries(rawStats).sort(([, a], [, b]) => b - a);

  if (levelMultiplier >= 19) {
    sortedStats.slice(0, 5).forEach(([key]) => {
      rawStats[key] += 2;
    });
  } else {
    sortedStats.slice(0, boostCount).forEach(([key]) => {
      rawStats[key] += 2;
    });
  }

  Object.keys(statIds).forEach((statKey) => {
    const roll = rawStats[statKey];
    const modifierValue = Math.floor((roll - 10) / 2);
    const modifierText = (modifierValue >= 0 ? "+" : "") + modifierValue;

    const { stat, modifier: modifierId } = statIds[statKey];
    const statElement = document.getElementById(stat);
    const modifierElement = document.getElementById(modifierId);

    if (statElement) statElement.textContent = roll;
    if (modifierElement) modifierElement.textContent = modifierText;

    npcModifiers[statKey] = modifierValue;
  });

  document.getElementById("hp").textContent =
    baseHP + npcModifiers.CON * levelMultiplier;
}

function rollProficiencies() {
  if (!currentSpecies) {
    console.error("Species not rolled yet.");
    return;
  }

  const abilities = [
    "strength",
    "dexterity",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  const abilityShortNames = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
  };

  const getRandomAbility = () => {
    const index = Math.floor(Math.random() * abilities.length);
    return abilities[index];
  };

  let ability1, ability2;
  do {
    ability1 = getRandomAbility();
    ability2 = getRandomAbility();
  } while (ability1 === ability2);

  const getRandomSkill = (ability) => {
    const entry = proficiencyData[ability];
    if (ability === "strength") {
      return entry.proficiency;
    }
    const skills = entry.map((skillObj) => skillObj.proficiency);
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    return randomSkill;
  };

  let skill1 = "";
  let shortAbility1 = "";

  if (currentSpecies === "Elf") {
    skill1 = currentSubspecies?.proficiency || getRandomSkill(ability1);
    shortAbility1 = "WIS";
  } else {
    skill1 = getRandomSkill(ability1);
    shortAbility1 = abilityShortNames[ability1];
  }

  const skill2 = getRandomSkill(ability2);
  const shortAbility2 = abilityShortNames[ability2];

  document.getElementById("save1").textContent = shortAbility1;
  document.getElementById("skill1").textContent = skill1;
  document.getElementById("save2").textContent = shortAbility2;
  document.getElementById("skill2").textContent = skill2;

  document.querySelectorAll(".modifier1").forEach((instance) => {
    const base = parseInt(npcModifiers[shortAbility1] ?? 0);
    instance.textContent = base + proficiencyBonus;
  });

  document.querySelectorAll(".modifier2").forEach((instance) => {
    const base = parseInt(npcModifiers[shortAbility2] ?? 0);
    instance.textContent = base + proficiencyBonus;
  });

  const passivePerception = document.getElementById("passive-perception");
  const wisModifier = npcModifiers.WIS ?? 0;

  if (skill1 === "Perception" || skill2 === "Perception") {
    passivePerception.textContent = 10 + wisModifier + proficiencyBonus;
  } else {
    passivePerception.textContent = 10 + wisModifier;
  }
}

function rollArmor() {
  const selection = document.getElementById("armor-selector").value;
  const armor = document.getElementById("armor");
  const ac = document.getElementById("ac");
  const baseAC = 10 + npcModifiers.DEX;
  const armorType = document.getElementById("armor-type");

  if (selection === "" || selection === "none") {
    armor.classList.add("hidden");
    ac.textContent = baseAC;
  } else {
    armor.classList.remove("hidden");

    const stealthDisadvantage = document.getElementById("stealth-disadvantage");
    const checkArmorMods = (armorToCheck) => {
      const overencumbered = document.getElementById("overencumbered");

      if (armorToCheck["stealth disadvantage"]) {
        traits.classList.remove("hidden");
        stealthDisadvantage.classList.remove("hidden");
      } else {
        stealthDisadvantage.classList.add("hidden");
      }

      if (armorToCheck["dex max"] && npcModifiers.DEX > 2) {
        ac.textContent = armorToCheck.ac + 2;
      } else ac.textContent = armorToCheck.ac + npcModifiers.DEX;

      if (armorToCheck["str min"] > npcModifiers.STR) {
        overencumbered.classList.remove("hidden");
      } else {
        overencumbered.classList.add("hidden");
      }

      armorType.textContent = armorToCheck.name;
    };

    if (selection === "light") {
      const selectedArmor =
        armorData.light[Math.floor(Math.random() * armorData.light.length)];
      checkArmorMods(selectedArmor);
    } else if (selection === "medium") {
      const selectedArmor =
        armorData.medium[Math.floor(Math.random() * armorData.medium.length)];
      checkArmorMods(selectedArmor);
    } else {
      const selectedArmor =
        armorData.heavy[Math.floor(Math.random() * armorData.heavy.length)];
      checkArmorMods(selectedArmor);
    }
  }
}

function rollWeapons() {
  const unarmedStrike = document.getElementById("unarmed-strike");
  const weaponAttacks = document.getElementById("weapon-attacks");
  const toHitSTR = npcModifiers.STR + proficiencyBonus;
  const toHitDEX = npcModifiers.DEX + proficiencyBonus;

  let selectedMeleeWeapon = "";
  let selectedRangedWeapon = "";

  if (!document.getElementById("armed-check").checked) {
    unarmedStrike.classList.remove("hidden");
    weaponAttacks.classList.add("hidden");
    document.getElementById("to-hit-unarmed").textContent = toHitSTR;
    document.getElementById("unarmed-dmg").textContent = npcModifiers.STR + 1;
  } else {
    unarmedStrike.classList.add("hidden");
    weaponAttacks.classList.remove("hidden");

    const multiattack = document.getElementById("multiattack");

    let meleeType = "martial";
    let rangedType = "martial";

    if (commoner.checked) {
      meleeType = "simple";
      rangedType = "simple";
    } else if (adventurer.checked || hero.checked) {
      if (Math.random() < 0.5) {
        meleeType = "simple";
        rangedType = "simple";
      }
    }

    if (commoner.checked) {
      multiattack.classList.add("hidden");
    } else if (adventurer.checked) {
      if (Math.random() > 0.66) multiattack.classList.remove("hidden");
      else multiattack.classList.add("hidden");
    } else if (hero.checked) {
      if (Math.random() > 0.33) multiattack.classList.remove("hidden");
      else multiattack.classList.add("hidden");
    } else {
      multiattack.classList.remove("hidden");
    }

    selectedMeleeWeapon =
      weaponsData.melee[meleeType][
        Math.floor(Math.random() * weaponsData.melee[meleeType].length)
      ];

    document
      .querySelectorAll(".melee-weapon")
      .forEach((instance) => (instance.textContent = selectedMeleeWeapon.name));

    const meleeModifier = document.querySelectorAll(".melee-modifier");
    const reach = document.getElementById("reach");

    if (selectedMeleeWeapon.finesse && npcModifiers.DEX > npcModifiers.STR) {
      meleeModifier.forEach((instance) => (instance.textContent = toHitDEX));
    } else {
      meleeModifier.forEach((instance) => (instance.textContent = toHitSTR));
    }

    if (selectedMeleeWeapon.reach) {
      reach.textContent = 10;
    } else {
      reach.textContent = 5;
    }

    document.getElementById("melee-dice").textContent =
      selectedMeleeWeapon["dmg dice"];
    document.getElementById("melee-dmg-type").textContent =
      selectedMeleeWeapon["dmg type"];

    selectedRangedWeapon =
      weaponsData.ranged[rangedType][
        Math.floor(Math.random() * weaponsData.ranged[rangedType].length)
      ];

    document.getElementById("ranged-weapon").textContent =
      selectedRangedWeapon.name;
    document
      .querySelectorAll(".ranged-modifier")
      .forEach((instance) => (instance.textContent = toHitDEX));
    document.getElementById("range").textContent = selectedRangedWeapon.range;
    document.getElementById("ranged-dmg-type").textContent =
      selectedRangedWeapon["dmg type"];
  }

  document.getElementById("breath-save").textContent =
    8 + npcModifiers.CON + proficiencyBonus;

  const breathDMG = document.getElementById("breath-dice");

  if (levelMultiplier >= 17) breathDMG.textContent = "4d10";
  else if (levelMultiplier >= 11) breathDMG.textContent = "3d10";
  else if (levelMultiplier >= 5) breathDMG.textContent = "2d10";
  else breathDMG.textContent = "1d10";
}

function rollSpells() {
  const spellcasterCheck = document.getElementById("spellcaster-check");
  const spellcasting = document.getElementById("spellcasting");

  if (!spellcasterCheck.checked) {
    spellcasting.classList.add("hidden");
  } else {
    traits.classList.remove("hidden");
    spellcasting.classList.remove("hidden");

    const spellcastingLevel = document.getElementById("spellcasting-level");
    const spellcastingAbility = document.getElementById("spellcasting-ability");
    const spellSave = document.getElementById("spell-save");
    const spellToHit = document.getElementById("spell-to-hit");

    const ordinal = (n) => {
      const ordinals = ["1st", "2nd", "3rd"];
      return ordinals[n - 1] || `${n}th`;
    };

    spellcastingLevel.textContent = new Set([8, 11, 18]).has(levelMultiplier)
      ? `an ${levelMultiplier}th`
      : `a ${ordinal(levelMultiplier)}`;

    const abilities = {
      Charisma: npcModifiers.CHA,
      Wisdom: npcModifiers.WIS,
      Intelligence: npcModifiers.INT,
    };

    const bestAbility = Object.entries(abilities).reduce((a, b) =>
      b[1] > a[1] ? b : a
    );

    spellcastingAbility.textContent = bestAbility[0];
    spellSave.textContent = 8 + bestAbility[1] + proficiencyBonus;
    spellToHit.textContent = bestAbility[1] + proficiencyBonus;

    const getRandomSpells = (spellArray, count) => {
      const selected = new Set();
      while (selected.size < count && selected.size < spellArray.length) {
        const index = Math.floor(Math.random() * spellArray.length);
        selected.add(spellArray[index]);
      }
      return Array.from(selected);
    };

    const generateSpellHTML = (level, spells, slots = null) => {
      const displayLevel =
        level === 0
          ? "Cantrips (at will)"
          : `${ordinal(level)} level${
              slots ? ` (${slots} slot${slots > 1 ? "s" : ""})` : ""
            }`;

      const spellLinks = spells.map((spell) => {
        const name = spell.name || spell;
        const url = spell.link || "#";
        return `<a href="${url}" class="italic hover:text-red active:brightness-90 underline" target="_blank">${name}</a>`;
      });

      return `<p>${displayLevel}: ${spellLinks.join(", ")}</p>`;
    };

    const spellsByLevel = {
      1: { cantrips: 3, spells: { 1: { slots: 2, count: 1 } } },
      2: { cantrips: 3, spells: { 1: { slots: 3, count: 1 } } },
      3: {
        cantrips: 3,
        spells: { 1: { slots: 4, count: 1 }, 2: { slots: 2, count: 1 } },
      },
      4: {
        cantrips: 4,
        spells: { 1: { slots: 4, count: 2 }, 2: { slots: 3, count: 1 } },
      },
      5: {
        cantrips: 4,
        spells: {
          1: { slots: 4, count: 2 },
          2: { slots: 3, count: 1 },
          3: { slots: 2, count: 1 },
        },
      },
      6: {
        cantrips: 4,
        spells: {
          1: { slots: 4, count: 2 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 1 },
        },
      },
      7: {
        cantrips: 4,
        spells: {
          1: { slots: 4, count: 2 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 1 },
          4: { slots: 1, count: 1 },
        },
      },
      8: {
        cantrips: 4,
        spells: {
          1: { slots: 4, count: 3 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 1 },
          4: { slots: 2, count: 1 },
        },
      },
      9: {
        cantrips: 4,
        spells: {
          1: { slots: 4, count: 3 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 1 },
          4: { slots: 3, count: 1 },
          5: { slots: 1, count: 1 },
        },
      },
      10: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 3 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
        },
      },
      11: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 3 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
        },
      },
      12: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
        },
      },
      13: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 2 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
          7: { slots: 1, count: 1 },
        },
      },
      14: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
          7: { slots: 1, count: 1 },
        },
      },
      15: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
          7: { slots: 1, count: 1 },
          8: { slots: 1, count: 1 },
        },
      },
      16: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 1 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
          7: { slots: 1, count: 1 },
          8: { slots: 1, count: 1 },
        },
      },
      17: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 2 },
          4: { slots: 3, count: 2 },
          5: { slots: 2, count: 1 },
          6: { slots: 1, count: 1 },
          7: { slots: 1, count: 1 },
          8: { slots: 1, count: 1 },
          9: { slots: 1, count: 1 },
        },
      },
      18: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 3 },
          4: { slots: 3, count: 2 },
          5: { slots: 3, count: 1 },
          6: { slots: 1, count: 1 },
          7: { slots: 1, count: 1 },
          8: { slots: 1, count: 1 },
          9: { slots: 1, count: 1 },
        },
      },
      19: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 3 },
          4: { slots: 3, count: 3 },
          5: { slots: 3, count: 1 },
          6: { slots: 2, count: 1 },
          7: { slots: 1, count: 1 },
          8: { slots: 1, count: 1 },
          9: { slots: 1, count: 1 },
        },
      },
      20: {
        cantrips: 5,
        spells: {
          1: { slots: 4, count: 4 },
          2: { slots: 3, count: 3 },
          3: { slots: 3, count: 3 },
          4: { slots: 3, count: 3 },
          5: { slots: 3, count: 2 },
          6: { slots: 2, count: 1 },
          7: { slots: 2, count: 1 },
          8: { slots: 1, count: 1 },
          9: { slots: 1, count: 1 },
        },
      },
    };

    const assignSpellsFromData = () => {
      if (!spellsData || !Object.keys(spellsData).length) return "";

      const preparedSpells = [];
      const spellConfig = spellsByLevel[levelMultiplier];
      if (!spellConfig) return "";

      const cantripArray = spellsData["cantrips"];
      if (cantripArray) {
        const selectedCantrips = getRandomSpells(
          cantripArray,
          spellConfig.cantrips
        );
        preparedSpells.push(generateSpellHTML(0, selectedCantrips));
      }

      for (const [levelStr, { slots, count }] of Object.entries(
        spellConfig.spells
      )) {
        const level = parseInt(levelStr);
        const spellsAtLevel = spellsData[`${ordinal(level)} level`] || [];
        if (!spellsAtLevel.length || !slots || !count) continue;

        const selectedSpells = getRandomSpells(spellsAtLevel, count);
        if (selectedSpells.length) {
          preparedSpells.push(generateSpellHTML(level, selectedSpells, slots));
        }
      }

      return preparedSpells.join("");
    };

    document.getElementById("spell-list").innerHTML = assignSpellsFromData();
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
  rollWeapons();
  rollSpells();
}

document.getElementById("roll-btn").addEventListener("click", rollNPC);
