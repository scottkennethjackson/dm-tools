const title = document.getElementById("title");
const statblockLink = document.getElementById("statblock-link");
const sizeInput = document.getElementById("size-input");
const levelSelector = document.getElementById("level-selector");
const rollBtn = document.getElementById("roll-btn");

const encounterTable = {
  1: { 1: undefined, 2: undefined, 3: "CR 1/4", 4: "CR 1/2", 5: "CR 1" },
  2: { 1: undefined, 2: undefined, 3: "CR 1/2", 4: "CR 1", 5: "CR 3" },
  3: { 1: undefined, 2: "CR 1/4", 3: "CR 1", 4: "CR 2", 5: "CR 4" },
  4: { 1: undefined, 2: "CR 1/4", 3: "CR 1", 4: "CR 2", 5: "CR 5" },
  5: { 1: "CR 1/4", 2: "CR 1", 3: "CR 2", 4: "CR 4", 5: "CR 8" },
  6: { 1: "CR 1/4", 2: "CR 1", 3: "CR 3", 4: "CR 5", 5: "CR 9" },
  7: { 1: "CR 1/2", 2: "CR 1", 3: "CR 3", 4: "CR 6", 5: "CR 10" },
  8: { 1: "CR 1/2", 2: "CR 1", 3: "CR 3", 4: "CR 6", 5: "CR 12" },
  9: { 1: "CR 1/2", 2: "CR 2", 3: "CR 4", 4: "CR 7", 5: "CR 12" },
  10: { 1: "CR 1/2", 2: "CR 2", 3: "CR 4", 4: "CR 7", 5: "CR 14" },
  11: { 1: "CR 1", 2: "CR 3", 3: "CR 5", 4: "CR 8", 5: "CR 15" },
  12: { 1: "CR 1", 2: "CR 3", 3: "CR 5", 4: "CR 10", 5: "CR 17" },
  13: { 1: "CR 1", 2: "CR 3", 3: "CR 6", 4: "CR 10", 5: "CR 17" },
  14: { 1: "CR 1", 2: "CR 4", 3: "CR 6", 4: "CR 11", 5: "CR 19" },
  15: { 1: "CR 1", 2: "CR 4", 3: "CR 7", 4: "CR 12", 5: "CR 20" },
  16: { 1: "CR 2", 2: "CR 4", 3: "CR 7", 4: "CR 13", 5: "CR 20" },
  17: { 1: "CR 2", 2: "CR 4", 3: "CR 8", 4: "CR 14", 5: "CR 21" },
  18: { 1: "CR 2", 2: "CR 5", 3: "CR 8", 4: "CR 14", 5: "CR 21" },
  19: { 1: "CR 2", 2: "CR 5", 3: "CR 9", 4: "CR 15", 5: "CR 22" },
  20: { 1: "CR 3", 2: "CR 6", 3: "CR 10", 4: "CR 16", 5: "CR 23" },
};

let monsterData = {};

fetch("../../json/monsters.json")
  .then((response) => response.json())
  .then((data) => {
    monsterData = data;
  });

function pluraliseMonster(name, count) {
  return count === 1 ? name : name.endsWith("s") ? name : `${name}s`;
}

function displayEncounter(multiplier, monsterName, monsterCR, monsterLink) {
  if (multiplier === 1) {
    title.innerHTML = `${monsterName} (${monsterCR})`;
  } else {
    title.innerHTML = `${multiplier} ${pluraliseMonster(
      monsterName,
      multiplier
    )} (${monsterCR})`;
  }

  statblockLink.classList.remove("hidden");
  statblockLink.setAttribute("href", monsterLink);
}

function rollScenario() {
  if (Object.keys(monsterData).length === 0) {
    alert("Monster data is still loading. Please try again in a moment.");
    return;
  }

  let partySize = Number(sizeInput.value);
  let partyLevel = Number(levelSelector.value);

  let scenario;
  if (partyLevel <= 2) {
    scenario = Math.ceil(Math.random() * 3 + 2);
  } else if (partyLevel <= 4) {
    scenario = Math.ceil(Math.random() * 4 + 1);
  } else {
    scenario = Math.ceil(Math.random() * 5);
  }

  let multiplier;

  switch (scenario) {
    case 1:
      multiplier = partySize * 4;
      break;
    case 2:
      multiplier = partySize * 2;
      break;
    case 3:
      multiplier = partySize; // 1 monster per character
      break;
    case 4:
      multiplier = Math.floor(partySize / 2);
      break;
    case 5:
      multiplier = Math.floor(partySize / 4);
      break;
    default:
      multiplier = partySize;
      break;
  }

  if (multiplier < 1) multiplier = 1;

  let selectedCR = encounterTable[partyLevel]?.[scenario];

  if (
    !selectedCR ||
    !monsterData[selectedCR] ||
    monsterData[selectedCR].length === 0
  ) {
    title.innerHTML = "No encounter found. Please try again.";
    statblockLink.classList.add("hidden");
    return;
  }

  let monsterList = monsterData[selectedCR];
  let randomMonster =
    monsterList[Math.floor(Math.random() * monsterList.length)];

  displayEncounter(
    multiplier,
    randomMonster.name,
    selectedCR,
    randomMonster.link
  );
}

rollBtn.addEventListener("click", rollScenario);
