const diceBtn = document.getElementById("dice-btn");
const closeBtn = document.getElementById("close-btn");
const diceTray = document.getElementById("dice-tray");
const d20Btn = document.getElementById("d20-btn");
const d20Counter = document.getElementById("d20-counter");
const d12Btn = document.getElementById("d12-btn");
const d12Counter = document.getElementById("d12-counter");
const d10Btn = document.getElementById("d10-btn");
const d10Counter = document.getElementById("d10-counter");
const d100Btn = document.getElementById("d100-btn");
const d100Counter = document.getElementById("d100-counter");
const d8Btn = document.getElementById("d8-btn");
const d8Counter = document.getElementById("d8-counter");
const d6Btn = document.getElementById("d6-btn");
const d6Counter = document.getElementById("d6-counter");
const d4Btn = document.getElementById("d4-btn");
const d4Counter = document.getElementById("d4-counter");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const diceResult = document.getElementById("dice-result");
const resetBtn = document.getElementById("reset-btn");

let numD20s = 0;
let numD12s = 0;
let numD10s = 0;
let numD100s = 0;
let numD8s = 0;
let numD6s = 0;
let numD4s = 0;

diceBtn.addEventListener("click", function () {
    closeBtn.classList.remove("hidden");
    closeBtn.classList.add("flex");
    diceTray.classList.remove("-top-[640px]");
    diceTray.classList.add("top-2");
});

closeBtn.addEventListener("click", function () {
    closeBtn.classList.remove("flex");
    closeBtn.classList.add("hidden");
    diceTray.classList.remove("top-2");
    diceTray.classList.add("-top-[640px]");

    numD20s = 0;
    numD12s = 0;
    numD10s = 0;
    numD100s = 0;
    numD8s = 0;
    numD6s = 0;
    numD4s = 0;

    d20Counter.textContent = numD20s;
    d12Counter.textContent = numD12s;
    d10Counter.textContent = numD10s;
    d100Counter.textContent = numD100s;
    d8Counter.textContent = numD8s;
    d6Counter.textContent = numD6s;
    d4Counter.textContent = numD4s;

    rollDiceBtn.classList.add("-left-full");
    rollDiceBtn.classList.remove("left-3.5");

    diceResult.textContent = "";
});

function addDice(diceVarName, diceCounter) {
    if (diceVarName === "numD20s") {
        numD20s += 1;
        diceCounter.textContent = numD20s;
    } else if (diceVarName === "numD12s") {
        numD12s += 1;
        diceCounter.textContent = numD12s;
    } else if (diceVarName === "numD10s") {
        numD10s += 1;
        diceCounter.textContent = numD10s;
    } else if (diceVarName === "numD100s") {
        numD100s += 1;
        diceCounter.textContent = numD100s;
    } else if (diceVarName === "numD8s") {
        numD8s += 1;
        diceCounter.textContent = numD8s;
    } else if (diceVarName === "numD6s") {
        numD6s += 1;
        diceCounter.textContent = numD6s;
    } else if (diceVarName === "numD4s") {
        numD4s += 1;
        diceCounter.textContent = numD4s;
    }
}

function showRollButton() {
    rollDiceBtn.classList.remove("-left-full");
    rollDiceBtn.classList.add("left-3.5");
}

function rollMultiple(numRolls, diceValue) {
    let total = 0;
    for (let i = 0; i < numRolls; i++) {
        total += Math.ceil(Math.random() * diceValue);
    }
    return total;
}

rollDiceBtn.addEventListener("click", function () {
    let total = 0;
    let rollDuration = 1000;
    let updateInterval = 50;
    let elapsed = 0;

    const rollingInterval = setInterval(() => {
        let fakeTotal = 
            rollMultiple(numD20s, 20) +
            rollMultiple(numD12s, 12) +
            rollMultiple(numD10s, 10) +
            rollMultiple(numD100s, 100) +
            rollMultiple(numD8s, 8) +
            rollMultiple(numD6s, 6) +
            rollMultiple(numD4s, 4);

        diceResult.innerHTML = `&nbsp;= ${fakeTotal}`;

        elapsed += updateInterval;
        if (elapsed >= rollDuration) {
            clearInterval(rollingInterval);

            total =
                rollMultiple(numD20s, 20) +
                rollMultiple(numD12s, 12) +
                rollMultiple(numD10s, 10) +
                rollMultiple(numD100s, 100) +
                rollMultiple(numD8s, 8) +
                rollMultiple(numD6s, 6) +
                rollMultiple(numD4s, 4);

            diceResult.innerHTML = `&nbsp;= ${total}`;
        }
    }, updateInterval);
});

d20Btn.addEventListener("click", function () {
    addDice("numD20s", d20Counter);
    showRollButton();
});

d12Btn.addEventListener("click", function () {
    addDice("numD12s", d12Counter);
    showRollButton();
});

d10Btn.addEventListener("click", function () {
    addDice("numD10s", d10Counter);
    showRollButton();
});

d100Btn.addEventListener("click", function () {
    addDice("numD100s", d100Counter);
    showRollButton();
});

d8Btn.addEventListener("click", function () {
    addDice("numD8s", d8Counter);
    showRollButton();
});

d6Btn.addEventListener("click", function () {
    addDice("numD6s", d6Counter);
    showRollButton();
});

d4Btn.addEventListener("click", function () {
    addDice("numD4s", d4Counter);
    showRollButton();
});

resetBtn.addEventListener("click", function () {
    resetBtn.classList.add("animate-rotate");
    setTimeout(() => {
        resetBtn.classList.remove("animate-rotate");
    }, 500);

    numD20s = 0;
    numD12s = 0;
    numD10s = 0;
    numD100s = 0;
    numD8s = 0;
    numD6s = 0;
    numD4s = 0;

    d20Counter.textContent = numD20s;
    d12Counter.textContent = numD12s;
    d10Counter.textContent = numD10s;
    d100Counter.textContent = numD100s;
    d8Counter.textContent = numD8s;
    d6Counter.textContent = numD6s;
    d4Counter.textContent = numD4s;

    rollDiceBtn.classList.add("-left-full");
    rollDiceBtn.classList.remove("left-3.5");

    diceResult.textContent = "";
});
