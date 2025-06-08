const title = document.getElementById('title');
const savagenessSlider = document.getElementById("savageness-slider");
const rollBtn = document.getElementById('roll-btn');

let numDice = 1;

function rollMultiple(numRolls) {
    let total = 0;
    for (let i = 0; i < numRolls; i++) {
        total += Math.ceil(Math.random() * 4);
    }
    return total;
}

rollBtn.addEventListener("click", function () {
    const level = parseInt(savagenessSlider.value);
    let rollDuration = 1000;
    let updateInterval = 50;
    let elapsed = 0;

    const rollingInterval = setInterval(() => {
        const fakeTotal = rollMultiple(level);
        title.textContent = `You Take: ${fakeTotal}`;

        elapsed += updateInterval;

        if (elapsed >= rollDuration) {
            clearInterval(rollingInterval);

            const total = rollMultiple(level);
            title.textContent = `You Take: ${total} Points of Psychic Damage`;
        }
    }, updateInterval);
});

