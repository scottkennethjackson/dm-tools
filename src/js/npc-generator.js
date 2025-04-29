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

  if (!names.male.length || !names.female.length || !names.surname.length) {
    console.warn("Name data is missing.");
    return;
  }  
}

function getRandomSpecies() {
  const speciesList = [
    "Dragonborn", "Dwarf", "Elf", "Gnome", "Goliath",
    "Halfling", "Human", "Orc", "Tiefling"
  ];
  return getRandom(speciesList);
}

function chooseSubspecies(species, speciesInfo) {
  if (Array.isArray(speciesInfo.subspecies) && speciesInfo.subspecies.length > 0) {
    return getRandom(speciesInfo.subspecies);
  }
  return null;
}

function updateDisplayName(species, subspecies) {
  const npcSpecies = document.getElementById("species");
  let displayName = species;

  if (subspecies?.type && species !== "Goliath") {
    displayName = `${subspecies.type} ${species}`;
  }

  npcSpecies.textContent = displayName;
  document.querySelectorAll(".npc").forEach((el) => (el.textContent = species));
}

function updateBasicAttributes(speciesInfo, subspecies) {
  document.getElementById("size").textContent = speciesInfo.size || "";
  document.getElementById("shape").textContent = speciesInfo["creature type"] || "";
  document.getElementById("speed").textContent = (subspecies?.["improved speed"] ?? speciesInfo.speed) || "";

  const darkvision = document.getElementById("darkvision");
  const range = subspecies?.["improved darkvision"] ??
                (speciesInfo.darkvision?.["has darkvision"] ? speciesInfo.darkvision.range : 0);

  darkvision.classList.toggle("hidden", !range);
  document.getElementById("darkvision-range").textContent = range || "";
}

function updateAbilities(species, speciesInfo, subspecies) {
  const ranged = document.getElementById("ranged-attack");
  const breath = document.getElementById("breath-weapon");
  const dmgRes = document.getElementById("dmg-resistances");

  let resistance = "";

  if (species === "Dragonborn") {
    ranged.classList.add("hidden");
    breath.classList.remove("hidden");
    resistance = subspecies?.element || "";
    document.querySelectorAll(".breath-dmg-type").forEach((el) => (el.textContent = resistance));
  } else {
    ranged.classList.remove("hidden");
    breath.classList.add("hidden");

    if (species === "Tiefling") {
      resistance = subspecies?.["damage resistance"] || "";
    } else {
      resistance = speciesInfo["damage resistance"] || "";
    }
  }

  dmgRes.classList.toggle("hidden", !resistance);
  document.getElementById("resistance").textContent = resistance || "";
}

function updateLanguages(species, speciesInfo, subspecies) {
  const core = subspecies?.languages?.["core languages"] ?? speciesInfo._coreLanguages;
  const additional = speciesInfo._additionalLanguage || [];

  const rollLang = (exclude = "") => {
    if (additional.length === 0) return "";
    let result;
    do {
      result = getRandom(additional);
    } while (result === exclude && additional.length > 1);
    return result;
  };

  let languages = core;

  if (species === "Human") {
    const lang2 = rollLang();
    const lang3 = rollLang(lang2);
    if (lang2 && lang3) languages += `, ${lang2} & ${lang3}`;
    else if (lang2) languages += ` & ${lang2}`;
  } else if (subspecies?.type !== "Chthonic") {
    const extra = rollLang();
    if (extra) languages += ` & ${extra}`;
  }

  document.getElementById("languages").textContent = languages || "";
}

function updateTraits(species, speciesInfo, subspecies) {
  const traitsBlock = document.getElementById("traits");
  const main = document.getElementById("main-trait");
  const sub = document.getElementById("sub-trait");
  const additional = document.getElementById("additional-traits");

  const traitEls = [
    [document.getElementById("trait1"), document.getElementById("trait1-description")],
    [document.getElementById("trait2"), document.getElementById("trait2-description")],
    [document.getElementById("trait3"), document.getElementById("trait3-description")],
    [document.getElementById("trait4"), document.getElementById("trait4-description")],
  ];

  traitsBlock.classList.add("hidden");
  main.classList.add("hidden");
  sub.classList.add("hidden");
  additional.classList.add("hidden");

  if (species === "Halfling" && Array.isArray(speciesInfo.traits)) {
    traitsBlock.classList.remove("hidden");
    main.classList.remove("hidden");
    sub.classList.remove("hidden");
    additional.classList.remove("hidden");

    speciesInfo.traits.forEach((trait, i) => {
      traitEls[i][0].textContent = trait?.name || "";
      traitEls[i][1].textContent = trait?.description || "";
    });
  } else if (species === "Goliath") {
    traitsBlock.classList.remove("hidden");
    main.classList.remove("hidden");
    sub.classList.remove("hidden");

    traitEls[0][0].textContent = speciesInfo.traits?.name || "";
    traitEls[0][1].textContent = speciesInfo.traits?.description || "";

    traitEls[1][0].textContent = subspecies?.["subspecies trait"]?.name || "";
    traitEls[1][1].textContent = subspecies?.["subspecies trait"]?.description || "";
  } else if (speciesInfo.traits) {
    traitsBlock.classList.remove("hidden");
    main.classList.remove("hidden");

    traitEls[0][0].textContent = speciesInfo.traits?.name || "";
    traitEls[0][1].textContent = speciesInfo.traits?.description || "";
  }
}

function updateBonusAction(speciesInfo) {
  const bonus = document.getElementById("bonus-actions");
  const bonusName = document.getElementById("bonus-name");
  const bonusDesc = document.getElementById("bonus-description");

  if (speciesInfo["bonus action"]) {
    bonus.classList.remove("hidden");
    bonusName.textContent = speciesInfo["bonus action"].name || "";
    bonusDesc.innerHTML = speciesInfo["bonus action"].description || "";
  } else {
    bonus.classList.add("hidden");
  }
}

function rollSpecies() {
  const species = getRandomSpecies();
  const speciesInfo = speciesData[species];
  if (!speciesInfo) return console.warn(`Species data for "${species}" not found.`);

  const selectedSubspecies = chooseSubspecies(species, speciesInfo);
  updateDisplayName(species, selectedSubspecies);
  updateBasicAttributes(speciesInfo, selectedSubspecies);
  updateAbilities(species, speciesInfo, selectedSubspecies);
  updateLanguages(species, speciesInfo, selectedSubspecies);
  updateTraits(species, speciesInfo, selectedSubspecies);
  updateBonusAction(speciesInfo);

  currentSpecies = species;
  currentSubspecies = selectedSubspecies;
}

function rollAlignment() {
  const lawfulness = getRandom(["Chaotic", "Neutral", "Lawful"]);
  const goodness = getRandom(["Evil", "Neutral", "Good"]);

  const alignment =
    lawfulness === "Neutral" && goodness === "Neutral"
      ? "True Neutral"
      : `${lawfulness} ${goodness}`;

  document.getElementById("alignment").textContent = alignment;
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

  const npcCategory = commoner.checked
    ? "commoner"
    : adventurer.checked
    ? "adventurer"
    : hero.checked
    ? "hero"
    : "legend";

  const { level: levelFn, hp: hpFn } = npcTypes[npcCategory];
  const level = levelFn();
  const hp = hpFn();

  baseHP = hp;
  levelMultiplier = level;
  proficiencyBonus = getProficiencyBonus(level);

  document.querySelectorAll(".proficiency-bonus").forEach((el) => {
    el.textContent = proficiencyBonus;
  });
}

function getProficiencyBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
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

  const statElements = Object.keys(statIds).reduce((acc, statKey) => {
    const { stat, modifier } = statIds[statKey];
    acc[statKey] = {
      statElement: document.getElementById(stat),
      modifierElement: document.getElementById(modifier),
    };
    return acc;
  }, {});

  const calculateStat = (statKey) => {
    let roll = rollD20();

    if (roll < 8) roll = 8;
    if (commoner.checked && roll > 14) roll = 14;
    else if (adventurer.checked && roll > 16) roll = 16;
    else if (hero.checked && roll > 18) roll = 18;

    const modifierValue = Math.floor((roll - 10) / 2);
    const modifierText = (modifierValue >= 0 ? "+" : "") + modifierValue;

    const { statElement, modifierElement } = statElements[statKey];

    if (statElement) statElement.textContent = roll;
    if (modifierElement) modifierElement.textContent = modifierText;

    npcModifiers[statKey] = modifierValue;
  };

  Object.keys(statIds).forEach(calculateStat);

  document.getElementById("hp").textContent =
    baseHP + npcModifiers.CON * levelMultiplier;
}

function rollProficiencies() {
  if (!currentSpecies) {
    console.error("Species not rolled yet.");
    return;
  }

  const abilities = ["strength", "dexterity", "intelligence", "wisdom", "charisma"];
  const abilityShortNames = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
  };

  const getRandomAbilities = () => {
    const [ability1, ability2] = abilities.sort(() => Math.random() - 0.5).slice(0, 2);
    return { ability1, ability2 };
  };

  const { ability1, ability2 } = getRandomAbilities();

  const getRandomSkill = (ability) => {
    const entry = proficiencyData[ability];
    return ability === "strength"
      ? entry.proficiency
      : entry[Math.floor(Math.random() * entry.length)].proficiency;
  };

  const skill1 = currentSpecies === "Elf"
    ? currentSubspecies?.proficiency || getRandomSkill(ability1)
    : getRandomSkill(ability1);

  const skill2 = getRandomSkill(ability2);

  const shortAbility1 = currentSpecies === "Elf" ? "WIS" : abilityShortNames[ability1];
  const shortAbility2 = abilityShortNames[ability2];

  const save1Elem = document.getElementById("save1");
  const skill1Elem = document.getElementById("skill1");
  const save2Elem = document.getElementById("save2");
  const skill2Elem = document.getElementById("skill2");

  save1Elem.textContent = shortAbility1;
  skill1Elem.textContent = skill1;
  save2Elem.textContent = shortAbility2;
  skill2Elem.textContent = skill2;

  const updateModifiers = (ability, skillClass) => {
    const base = parseInt(npcModifiers[ability] ?? 0);
    document.querySelectorAll(skillClass).forEach((instance) => {
      instance.textContent = base + proficiencyBonus;
    });
  };

  updateModifiers(shortAbility1, ".modifier1");
  updateModifiers(shortAbility2, ".modifier2");

  const passivePerception = document.getElementById("passive-perception");
  const wisModifier = npcModifiers.WIS ?? 0;
  passivePerception.textContent = (skill1 === "Perception" || skill2 === "Perception")
    ? 10 + wisModifier + proficiencyBonus
    : 10 + wisModifier;
}

function rollArmor() {
  const selection = document.getElementById("armor-selector").value;
  const armor = document.getElementById("armor");
  const ac = document.getElementById("ac");
  const stealthDisadvantage = document.getElementById("stealth-disadvantage");
  const overencumbered = document.getElementById("overencumbered");
  const traits = document.getElementById("traits");

  if (selection === "" || selection === "none") {
    armor.classList.add("hidden");
  } else {
    armor.classList.remove("hidden");

    const checkArmorMods = (armorToCheck) => {
      if (armorToCheck["stealth disadvantage"]) {
        traits.classList.remove("hidden");
        stealthDisadvantage.classList.remove("hidden");
      } else {
        stealthDisadvantage.classList.add("hidden");
      }

      if (armorToCheck["dex max"] && npcModifiers.DEX > 2) {
        ac.textContent = armorToCheck.ac + 2;
      } else {
        ac.textContent = armorToCheck.ac + npcModifiers.DEX;
      }

      if (armorToCheck["str min"] > npcModifiers.STR) {
        overencumbered.classList.remove("hidden");
      } else {
        overencumbered.classList.add("hidden");
      }

      document.getElementById("armor-type").textContent = armorToCheck.name;
    };

    let selectedArmor;
    switch (selection) {
      case "light":
        selectedArmor = armorData.light[Math.floor(Math.random() * armorData.light.length)];
        break;
      case "medium":
        selectedArmor = armorData.medium[Math.floor(Math.random() * armorData.medium.length)];
        break;
      case "heavy":
        selectedArmor = armorData.heavy[Math.floor(Math.random() * armorData.heavy.length)];
        break;
      default:
        return;
    }

    checkArmorMods(selectedArmor);
  }
}

function rollWeapons() {
  const unarmedStrike = document.getElementById("unarmed-strike");
  const weaponAttacks = document.getElementById("weapon-attacks");
  const multiattack = document.getElementById("multiattack");
  const toHitSTR = npcModifiers.STR + proficiencyBonus;
  const toHitDEX = npcModifiers.DEX + proficiencyBonus;

  const getWeaponType = (type, category) => {
    if (category === "commoner") return "simple";
    if (category === "adventurer" || category === "hero") return Math.random() < 0.5 ? "simple" : "martial";
  };

  if (!document.getElementById("armed-check").checked) {
    unarmedStrike.classList.remove("hidden");
    weaponAttacks.classList.add("hidden");
    document.getElementById("to-hit-unarmed").textContent = toHitSTR;
    document.getElementById("unarmed-dmg").textContent = npcModifiers.STR + 1;
  } else {
    unarmedStrike.classList.add("hidden");
    weaponAttacks.classList.remove("hidden");

    const npcCategory = commoner.checked ? "commoner" : adventurer.checked ? "adventurer" : hero.checked ? "hero" : "legend";
    multiattack.classList.toggle("hidden", npcCategory === "commoner" || Math.random() <= (npcCategory === "adventurer" ? 0.66 : 0.33));

    const meleeType = getWeaponType("martial", npcCategory);
    const selectedMeleeWeapon = weaponsData.melee[meleeType][Math.floor(Math.random() * weaponsData.melee[meleeType].length)];
    document.querySelectorAll(".melee-weapon").forEach((instance) => (instance.textContent = selectedMeleeWeapon.name));

    const meleeModifier = selectedMeleeWeapon.finesse && npcModifiers.DEX > npcModifiers.STR ? toHitDEX : toHitSTR;
    document.querySelectorAll(".melee-modifier").forEach((instance) => (instance.textContent = meleeModifier));

    document.getElementById("reach").textContent = selectedMeleeWeapon.reach ? 10 : 5;
    document.getElementById("melee-dice").textContent = selectedMeleeWeapon["dmg dice"];
    document.getElementById("melee-dmg-type").textContent = selectedMeleeWeapon["dmg type"];

    const rangedType = getWeaponType("martial", npcCategory);
    const selectedRangedWeapon = weaponsData.ranged[rangedType][Math.floor(Math.random() * weaponsData.ranged[rangedType].length)];
    document.getElementById("ranged-weapon").textContent = selectedRangedWeapon.name;
    document.querySelectorAll(".ranged-modifier").forEach((instance) => (instance.textContent = toHitDEX));
    document.getElementById("range").textContent = selectedRangedWeapon.range;
    document.getElementById("ranged-dmg-type").textContent = selectedRangedWeapon["dmg type"];
  }

  document.getElementById("breath-save").textContent = 8 + npcModifiers.CON + proficiencyBonus;

  const breathDMG = document.getElementById("breath-dice");
  if (levelMultiplier >= 17) breathDMG.textContent = "4d10";
  else if (levelMultiplier >= 11) breathDMG.textContent = "3d10";
  else if (levelMultiplier >= 5) breathDMG.textContent = "2d10";
  else breathDMG.textContent = "1d10";
}

function rollSpells() {
  const spellcasting = document.getElementById("spellcasting");

  if (!document.getElementById("spellcaster-check").checked) {
    spellcasting.classList.add("hidden");
    return;
  }

  traits.classList.remove("hidden");
  spellcasting.classList.remove("hidden");

  const ordinal = (n) => {
    const ordinals = ["1st", "2nd", "3rd"];
    return ordinals[n - 1] || `${n}th`;
  };

  const levelText = [8, 11, 18].includes(levelMultiplier)
    ? `an ${levelMultiplier}th`
    : `a ${ordinal(levelMultiplier)}`;
  document.getElementById("spellcasting-level").textContent = levelText;

  const abilities = {
    Charisma: npcModifiers.CHA,
    Wisdom: npcModifiers.WIS,
    Intelligence: npcModifiers.INT,
  };

  const bestAbility = Object.entries(abilities).reduce((best, curr) =>
    curr[1] > best[1] ? curr : best
  );

  document.getElementById("spellcasting-ability").textContent = bestAbility[0];
  document.getElementById("spell-save").textContent = 8 + bestAbility[1] + proficiencyBonus;
  document.getElementById("spell-to-hit").textContent = bestAbility[1] + proficiencyBonus;

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
        : `${ordinal(level)} level${slots ? ` (${slots} slot${slots > 1 ? "s" : ""})` : ""}`;

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
    3: { cantrips: 3, spells: { 1: { slots: 4, count: 1 }, 2: { slots: 2, count: 1 } } },
    20: { cantrips: 5, spells: { 1: { slots: 4, count: 4 }, 2: { slots: 3, count: 3 }, 3: { slots: 3, count: 3 }, 4: { slots: 3, count: 3 }, 5: { slots: 3, count: 2 }, 6: { slots: 2, count: 1 }, 7: { slots: 2, count: 1 }, 8: { slots: 1, count: 1 }, 9: { slots: 1, count: 1 } } },
  };

  const assignSpellsFromData = () => {
    if (!spellsData || !Object.keys(spellsData).length) return "";

    const preparedSpells = [];
    const spellConfig = spellsByLevel[levelMultiplier];
    if (!spellConfig) return "";

    const cantripArray = spellsData["cantrips"];
    if (cantripArray) {
      const selectedCantrips = getRandomSpells(cantripArray, spellConfig.cantrips);
      preparedSpells.push(generateSpellHTML(0, selectedCantrips));
    }

    for (const [levelStr, { slots, count }] of Object.entries(spellConfig.spells)) {
      const level = parseInt(levelStr);
      const spellsAtLevel = spellsData[`${ordinal(level)} level`] || [];
      if (spellsAtLevel.length && slots && count) {
        const selectedSpells = getRandomSpells(spellsAtLevel, count);
        if (selectedSpells.length) {
          preparedSpells.push(generateSpellHTML(level, selectedSpells, slots));
        }
      }
    }

    return preparedSpells.join("");
  };

  document.getElementById("spell-list").innerHTML = assignSpellsFromData();
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
