// Element references
//const hintBtn = document.getElementById("hint-btn");
//const playAgainBtn = document.getElementById("play-again-btn");
//const word = document.getElementById("word");
//const hint = document.getElementById("hint");
//const hpCounter = document.querySelector("#lives-counter");
// const message = document.querySelector("#alert");
// const messageDiv = document.getElementById("alert-container");
// const hpDiv = document.getElementById("countdown-container");

// let hp = 10;
// let magicItems = [];
// let monsters = [];
// let races = [];
// let spells = [];
// let selectedWord = "";
// let currentCategory = "";

// Fetch D&D data
// async function fetchNames(url) {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch ${url}: ${response.status}`);
//     }
//     const data = await response.json();
//     const names = [];
//     for (const category in data) {
//         if (Array.isArray(data[category])) {
//             data[category].forEach((item) => {
//                 if (item.name) {
//                     names.push(item.name);
//                 }
//             });
//         }
//     }
//     return names;
// }

// // Pick random clean word
// function getWord() {
//     const roll = Math.ceil(Math.random() * 4);
//     let array = [];

//     if (roll === 1) {
//         array = magicItems;
//         currentCategory = "Magic Item";
//     } else if (roll === 2) {
//         array = monsters;
//         currentCategory = "Monster";
//     } else if (roll === 3) {
//         array = races;
//         currentCategory = "Race";
//     } else {
//         array = spells;
//         currentCategory = "Spell";
//     }

//     let tries = 0;
//     const maxTries = 20;
//     do {
//         const wordRoll = Math.floor(Math.random() * array.length);
//         selectedWord = array[wordRoll];
//         tries++;
//     } while ((/[^\w\s]/.test(selectedWord) || selectedWord.length < 5) && tries < maxTries);

//     hint.textContent = currentCategory;
// }

// // Build visual word tiles
// function setUpWord() {
//     word.innerHTML = "";
//     const wordArray = selectedWord.split(" ");

//     wordArray.forEach((wordPart, j) => {
//         const wordDiv = document.createElement("div");
//         wordDiv.classList.add("word", `index${j}`);
//         word.appendChild(wordDiv);

//         for (let i = 0; i < wordPart.length; i++) {
//             const letter = wordPart[i];
//             const tile = document.createElement("div");
//             tile.dataset.letter = letter.toLowerCase();
//             tile.dataset.tag = letter.toLowerCase();
//             tile.className = "tile unflipped";
//             wordDiv.appendChild(tile);
//         }
//     });
// }

// // Lives setup
// function setUpLives() {
//     hp = 10;
//     hpCounter.innerHTML = `${hp}`;
// }

// function reduceLives() {
//     hp--;
//     hpCounter.innerHTML = `${hp}`;
// }

// Handle hint button
hintBtn.addEventListener("click", function() {
    hintBtn.innerHTML = currentCategory;
    hintBtn.classList.add("revealed");
});

// // Game logic
// function startGame() {
//     document.addEventListener("click", handleMouseClick);
//     document.addEventListener("keydown", handleKeyPress);
// }

// function stopGame() {
//     document.removeEventListener("click", handleMouseClick);
//     document.removeEventListener("keydown", handleKeyPress);
//     messageDiv.classList.add("visible");
//     hpDiv.classList.add("hidden");
// }

// function handleMouseClick(e) {
//     if (e.target.matches("[data-key]")) {
//         pressKey(e.target.dataset.key);
//     }
// }

// function handleKeyPress(e) {
//     if (e.key.match(/^[a-zA-Z]$/)) {
//         pressKey(e.key);
//     }
// }

// function pressKey(key) {
//     key = key.toUpperCase();
//     const wordUpper = selectedWord.toUpperCase();
//     const pressedKey = document.querySelector(`[data-key=${key}]`);

//     if (wordUpper.includes(key)) {
//         correctGuess(key);
//         checkWin();
//     } else {
//         if (pressedKey) pressedKey.classList.add("incorrect");
//         reduceLives();
//         if (hp === 0) {
//             revealMissingLetters();
//             stopGame();
//             shakeTiles();
//             showAlert("Better luck next time");
//         }
//     }
// }

// function correctGuess(key) {
//     const correctKeys = document.querySelectorAll(`[data-letter=${key.toLowerCase()}]`);
//     correctKeys.forEach(tile => {
//         tile.className = "tile correct flipped";
//         tile.innerHTML = key;
//     });
// }

// function checkWin() {
//     const unflippedTiles = document.querySelectorAll(".tile.unflipped");
//     if (unflippedTiles.length === 0) {
//         let message = "";
//         if (hp > 8) message = "Impressive!";
//         else if (hp > 5) message = "Awesome!";
//         else if (hp > 2) message = "Well done!";
//         else message = "Phew!";
//         stopGame();
//         bounceTiles();
//         showAlert(message);
//     }
// }

// function revealMissingLetters() {
//     const remainingTiles = document.querySelectorAll(".tile.unflipped");
//     remainingTiles.forEach(tile => {
//         tile.className = "tile missing flipped";
//         tile.innerHTML = tile.dataset.tag.toUpperCase();
//     });
// }

// Post-game UI
function showAlert(message) {
    message.innerHTML = message;
}

playAgainBtn.addEventListener("click", function() {
    location.reload();
});


// // Start after loading D&D data
// Promise.all([
//     fetchNames("../json/magic-items.json"),
//     fetchNames("../json/monsters.json"),
//     fetchNames("../json/races.json"),
//     fetchNames("../json/spells.json"),
// ])
//     .then(([magicItem, monster, race, spell]) => {
//         magicItems = magicItem;
//         monsters = monster;
//         races = race;
//         spells = spell;

//         getWord();
//         setUpWord();
//         setUpLives();
//         startGame();
//     })
//     .catch((error) => {
//         console.error("Error fetching data:", error);
//         word.textContent = "Failed to load data";
//     });
