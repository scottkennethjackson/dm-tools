const word = document.getElementById("word");
const message = document.getElementById("message");
const hint = document.getElementById("hint");
const hintBtn = document.getElementById("hint-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const hpCounter = document.getElementById("hp-counter");

const activeClasses = ["bg-gray-400", "active:brightness-90", "cursor-pointer"];
const inactiveClasses = ["pressed", "bg-gray-600"];
const correctClasses = ["pressed", "bg-red"];

let hp = 10;
let magicItems = [];
let monsters = [];
let races = [];
let spells = [];
let selectedWord = "";
let selectedWordUpper = "";
let currentCategory = "";
const keyMap = new Map();

async function fetchWords(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    const data = await response.json();
    const words = [];
    for (const category in data) {
        if (Array.isArray(data[category])) {
            data[category].forEach((word) => {
                if (word.name) {
                    words.push(word.name);
                }
            });
        }
    }
    return words;
}

function getWord() {
    const roll = Math.ceil(Math.random() * 4);
    let array = [];

    if (roll === 1) {
        array = magicItems;
        currentCategory = "Magic Item";
    } else if (roll === 2) {
        array = monsters;
        currentCategory = "Monster";
    } else if (roll === 3) {
        array = races;
        currentCategory = "Race";
    } else {
        array = spells;
        currentCategory = "Spell";
    }

    let tries = 0;
    const maxTries = 20;

    do {
        const wordRoll = Math.floor(Math.random() * array.length);
        selectedWord = array[wordRoll];
        selectedWordUpper = selectedWord.toUpperCase(); // cache for reuse
        tries++;
    } while ((/[^\w\s]/.test(selectedWord) || selectedWord.length < 5 || selectedWord === "Prestidigitation") && tries < maxTries);

    hint.textContent = currentCategory;
}

function setUpWord() {
    word.textContent = "";
    const wordArray = selectedWord.split(" ");

    wordArray.forEach((part, j) => {
        const wordDiv = document.createElement("div");
        wordDiv.classList.add("word", `index${j}`, "flex", "space-x-1", "space-y-2");
        word.appendChild(wordDiv);

        for (let i = 0; i < part.length; i++) {
            const letter = part[i];
            const tile = document.createElement("div");
            tile.dataset.letter = letter.toLowerCase();
            tile.dataset.tag = letter.toLowerCase();
            tile.classList.add("tile", "unflipped", "size-8", "text-center", "border", "border-red");
            wordDiv.appendChild(tile);
        }
    });
}

function showHint() {
    hintBtn.classList.add("hidden");
    reduceLives()
}

function setUpLives() {
    hp = 10;
    hpCounter.textContent = hp;
}

function reduceLives() {
    hp--;
    hpCounter.textContent = hp;

    if (hp === 0) {
        message.textContent = "Critical Fail!";
        revealMissingLetters();
        stopGame();
    }
}

function startGame() {
    document.addEventListener("click", handleMouseClick);
    document.addEventListener("keydown", handleKeyPress);
}

function stopGame() {
    document.removeEventListener("click", handleMouseClick);
    document.removeEventListener("keydown", handleKeyPress);
    message.classList.remove("invisible");
    playAgainBtn.classList.remove("hidden");
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key);
    }
}

function handleKeyPress(e) {
    const key = e.key.toUpperCase();
    if (key.match(/^[a-zA-Z]$/)) {
        pressKey(e.key);
    }
}

function pressKey(key) {
    key = key.toUpperCase();
    const pressedKey = keyMap.get(key);
    if (!pressedKey || pressedKey.classList.contains("pressed")) return;

    pressedKey.classList.remove(...activeClasses);

    if (selectedWordUpper.includes(key)) {
        pressedKey.classList.add(...correctClasses);
        correctGuess(key);
        checkWin();
    } else {
        pressedKey.classList.add(...inactiveClasses);
        reduceLives();
    }
}

function correctGuess(key) {
    const correctKeys = document.querySelectorAll(`[data-letter=${key.toLowerCase()}]`);
    correctKeys.forEach(tile => {
        tile.classList.remove("unflipped");
        tile.classList.add("animate-flip");
        setTimeout(() => {
            tile.classList.add("bg-red");
            tile.textContent = key;
        }, 350);
    });
}

function checkWin() {
    const unflippedTiles = document.querySelectorAll(".tile.unflipped");
    if (unflippedTiles.length === 0) {
        if (hp === 10) message.textContent = "Critical Success!";
        else if (hp > 8) message.textContent = "Impressive!";
        else if (hp > 5) message.textContent = "Well Done!";
        else if (hp > 2) message.textContent = "Close One!";
        else message.textContent = "Phew!";
        stopGame();
    }
}

function revealMissingLetters() {
    const remainingTiles = document.querySelectorAll(".tile.unflipped");
    remainingTiles.forEach(tile => {
        tile.classList.add("animate-flip");
    });
    setTimeout(() => {
        remainingTiles.forEach(tile => {
            tile.textContent = tile.dataset.tag.toUpperCase();
        });
    }, 350);
}

function playAgain() {
    hintBtn.classList.remove("hidden");
    playAgainBtn.classList.add("hidden");
    message.classList.add("invisible");

    keyMap.forEach((keyEl) => {
        keyEl.classList.remove(...inactiveClasses, ...correctClasses);
        keyEl.classList.add(...activeClasses);
    });

    getWord();
    setUpWord();
    setUpLives();
    startGame();
}

// Build keyMap on startup
document.querySelectorAll("[data-key]").forEach(el => {
    keyMap.set(el.dataset.key.toUpperCase(), el);
});

word.addEventListener("click", getWord);
hintBtn.addEventListener("click", showHint);
playAgainBtn.addEventListener("click", playAgain);

Promise.all([
    fetchWords("../json/magic-items.json"),
    fetchWords("../json/monsters.json"),
    fetchWords("../json/races.json"),
    fetchWords("../json/spells.json"),
])
    .then(([magicItem, monster, race, spell]) => {
        magicItems = magicItem;
        monsters = monster;
        races = race;
        spells = spell;

        getWord();
        setUpWord();
        setUpLives();
        startGame();
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        word.textContent = "Failed to load data";
    });
