const title = document.getElementById('title');
const modifier = document.querySelectorAll('.modifier');
const levelSelector = document.getElementById('level-selector');
const hoardCheck = document.getElementById('hoard-check');
const conversionLink = document.getElementById('conversion-link');
const rollBtn = document.getElementById('roll-btn');

function handleCheck() {
    modifier.forEach(instance => {
        instance.innerHTML = (instance.innerHTML === 'Player') ? 'Party' : 'Player';
    });
}

hoardCheck.addEventListener('change', handleCheck);

function rollD100() {
    return Math.ceil(Math.random() * 100);
}

function rollMultiple(numRolls, diceValue) {
    let total = 0;
    for (let i = 0; i < numRolls; i++) {
        total += Math.ceil(Math.random() * diceValue);
    }
    return total;
}

function determineLoot(level, hoard, roll) {
    let coins = [];

    if (level <= 4) {
        if (!hoard) {
            if (roll <= 30) coins.push({ value: rollMultiple(5, 6), currency: "CP" });
            else if (roll <= 60) coins.push({ value: rollMultiple(4, 6), currency: "SP" });
            else if (roll <= 70) coins.push({ value: rollMultiple(3, 6), currency: "EP" });
            else if (roll <= 95) coins.push({ value: rollMultiple(3, 6), currency: "GP" });
            else coins.push({ value: rollMultiple(1, 6), currency: "PP" });
        } else {
            coins.push(
                { value: rollMultiple(6, 6) * 100, currency: "CP" },
                { value: rollMultiple(3, 6) * 100, currency: "SP" },
                { value: rollMultiple(2, 6) * 10, currency: "GP" }
            );
        }
    }

    else if (level <= 10) {
        if (!hoard) {
            if (roll <= 30) {
                coins.push(
                    { value: rollMultiple(4, 6) * 100, currency: "CP" },
                    { value: rollMultiple(1, 6) * 10, currency: "EP" }
                );
            } else if (roll <= 60) {
                coins.push(
                    { value: rollMultiple(6, 6) * 10, currency: "SP" },
                    { value: rollMultiple(2, 6) * 10, currency: "GP" }
                );
            } else if (roll <= 70) {
                coins.push(
                    { value: rollMultiple(3, 6) * 10, currency: "EP" },
                    { value: rollMultiple(2, 6) * 10, currency: "GP" }
                );
            } else if (roll <= 95) {
                coins.push({ value: rollMultiple(4, 6) * 10, currency: "GP" });
            } else {
                coins.push(
                    { value: rollMultiple(2, 6) * 10, currency: "GP" },
                    { value: rollMultiple(3, 6), currency: "PP" }
                );
            }
        } else {
            coins.push(
                { value: rollMultiple(2, 6) * 100, currency: "CP" },
                { value: rollMultiple(2, 6) * 1000, currency: "SP" },
                { value: rollMultiple(6, 6) * 100, currency: "GP" },
                { value: rollMultiple(3, 6) * 10, currency: "PP" }
            );
        }
    }

    else if (level <= 16) {
        if (!hoard) {
            if (roll <= 20) {
                coins.push(
                    { value: rollMultiple(4, 6) * 100, currency: "SP" },
                    { value: rollMultiple(1, 6) * 100, currency: "GP" }
                );
            } else if (roll <= 35) {
                coins.push(
                    { value: rollMultiple(1, 6) * 100, currency: "EP" },
                    { value: rollMultiple(1, 6) * 100, currency: "GP" }
                );
            } else if (roll <= 75) {
                coins.push(
                    { value: rollMultiple(2, 6) * 100, currency: "GP" },
                    { value: rollMultiple(1, 6) * 10, currency: "PP" }
                );
            } else {
                coins.push(
                    { value: rollMultiple(2, 6) * 100, currency: "GP" },
                    { value: rollMultiple(2, 6) * 10, currency: "PP" }
                );
            }
        } else {
            coins.push(
                { value: rollMultiple(4, 6) * 1000, currency: "GP" },
                { value: rollMultiple(5, 6) * 100, currency: "PP" }
            );
        }
    }

    else if (level >= 17) {
        if (!hoard) {
            if (roll <= 15) {
                coins.push(
                    { value: rollMultiple(2, 6) * 1000, currency: "EP" },
                    { value: rollMultiple(8, 6) * 100, currency: "GP" }
                );
            } else if (roll <= 55) {
                coins.push(
                    { value: rollMultiple(1, 6) * 1000, currency: "GP" },
                    { value: rollMultiple(1, 6) * 100, currency: "PP" }
                );
            } else {
                coins.push(
                    { value: rollMultiple(1, 6) * 1000, currency: "GP" },
                    { value: rollMultiple(2, 6) * 100, currency: "PP" }
                );
            }
        } else {
            coins.push(
                { value: rollMultiple(12, 6) * 1000, currency: "GP" },
                { value: rollMultiple(8, 6) * 1000, currency: "PP" }
            );
        }
    }

    return coins;
}

function formatCoins(coins) {
    return coins
        .filter(c => c.value > 0)  // skip any zero results
        .map(c => `${c.value} ${c.currency}`)
        .join(', ')
        .replace(/,([^,]*)$/, ' &$1'); // last comma becomes ' &'
}

function rollGold() {
    const level = Number(levelSelector.value);
    const hoard = hoardCheck.checked;
    const roll = rollD100();

    conversionLink.classList.remove('hidden');

    const coins = determineLoot(level, hoard, roll);
    title.innerHTML = formatCoins(coins);
}

rollBtn.addEventListener('click', rollGold);
