const unarmedStrike = document.getElementById("unarmed-strike");
const multiattack = document.getElementById("multiattack");
const attacker = document.getElementById("attacker");
const multiattackType = document.getElementById("multiattack-type");
const meleeWeapon = document.getElementById("melee-weapon");
const toHit = document.querySelectorAll(".to-hit");
const reach = document.getElementById("reach");
const meleeDice = document.getElementById("melee-dice");
const meleeDmgType = document.getElementById("ranged-dmg-type");
const rangedAttack = document.getElementById("ranged-attack");
const rangedWeapon = document.getElementById("ranged-weapon");
const range = document.getElementById("range");
const rangedDice = document.getElementById("ranged-dice");
const rangedDmgType = document.getElementById("ranged-dmg-type");
const breathWeapon = document.getElementById("breath-weapon");
const breathSave = document.getElementById("breath-save");
const breathDice = document.getElementById("breath-dice");

// Start here
const title = document.getElementById("title");
const commoner = document.getElementById("commoner-radio");
const adventurer = document.getElementById("adventurer-radio");
const hero = document.getElementById("hero-radio");

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
  ])
  .then(([namesData, speciesJson, proficienciesJson, armorJson]) => {
      names.male = namesData["first names"]?.male.map((obj) => obj.name) || [];
      names.female = namesData["first names"]?.female.map((obj) => obj.name) || [];
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
          additionalLang = speciesInfo.languages["additional language"]?.map(
            (l) => l.language
          ) ?? [];
        }
  
        speciesInfo._coreLanguages = coreLangs;
        speciesInfo._additionalLanguage = additionalLang;
      }
  
      speciesData = speciesJson;
      proficiencyData = proficienciesJson;
      armorData = armorJson;
  })
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
  const npc = document.querySelectorAll("npc");

  if (!speciesInfo) {
    console.warn(`Species data for "${species}" not found.`);
    return;
  }

  document.querySelectorAll(".npc").forEach((instance => (instance.textContent = species)));
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

  const dmgResistances = document.getElementById("dmg-resistances");
  let resistance = "";

  if (species === "Dragonborn") {
    const element = selectedSubspecies.element;

    dmgResistances.classList.remove("hidden");
    resistance = element;
    document.getElementById("ranged-attack").classList.add("hidden");
    document.getElementById("breath-weapon").classList.remove("hidden");
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

  function rollAdditionalLang(exclude = "") {
    const additional = speciesInfo._additionalLanguage;

    if (!additional.length) return "";

    let result;

    do {
      result = additional[Math.floor(Math.random() * additional.length)];
    } while (result === exclude && additional.length > 1);
    return result;
  }

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

  const traits = document.getElementById("traits");
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

    const stealthDisadvantage = document.getElementById('stealth-disadvantage');
    const checkArmorMods = (armorToCheck) => {
        const overencumbered = document.getElementById('overencumbered');

        if (armorToCheck['stealth disadvantage']) {
            traits.classList.remove('hidden');
            stealthDisadvantage.classList.remove('hidden');
        } else {
            stealthDisadvantage.classList.add('hidden');
        }

        if (armorToCheck['dex max'] && npcModifiers.DEX > 2) {
            ac.textContent = armorToCheck.ac + 2;
        } else ac.textContent = armorToCheck.ac + npcModifiers.DEX;

        if (armorToCheck['str min'] > npcModifiers.STR) {
            overencumbered.classList.remove('hidden');
        } else {
            overencumbered.classList.add('hidden');
        }

        armorType.textContent = armorToCheck.name;
    }

    if (selection === "light") {
        const selectedArmor = armorData.light[Math.floor(Math.random() * armorData.light.length)];
        checkArmorMods(selectedArmor);
    } else if (selection === "medium") {
        const selectedArmor = armorData.medium[Math.floor(Math.random() * armorData.medium.length)];
        checkArmorMods(selectedArmor);
    } else {
        const selectedArmor = armorData.heavy[Math.floor(Math.random() * armorData.heavy.length)];
        checkArmorMods(selectedArmor);
    }    
  }
}

// function getWeapons() {}
// function getSpells() {}

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
