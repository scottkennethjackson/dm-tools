const title = document.getElementById('title');
const variable = document.getElementById('variable');
const levelSelector = document.getElementById('level-selector');
const hoardCheck = document.getElementById('hoard-check');
const rollBtn = document.getElementById('roll-btn');

let roll;
let coin1Value;
let coin1Currency;
let coin2Value;
let coin2Currency;
let coin3Value;
let coin3Currency;
let coin4Value;
let coin4Currency;

function handleCheck() {
    if (variable.innerHTML == 'Player') {
        variable.innerHTML = 'Party';
    } else {
        variable.innerHTML = 'Player';
    };
};

hoardCheck.addEventListener('change', handleCheck);

function rollD100() {
    return roll = Math.ceil(Math.random() * 100);
};

function rollMultiple(numRolls, diceValue) {
    let total = 0;

    for (let timesRolled = 0; timesRolled < numRolls; timesRolled++) {
        total+= Math.ceil(Math.random() * diceValue);
    };
    
    return total;
};

function rollGold() {
    let level = levelSelector.value;

    rollD100();

    switch(true) {
        case (level <= 4 && !hoardCheck.checked && roll <= 30):
            coin1Value = rollMultiple(5, 6);
            coin1Currency = "CP";
            title.innerHTML = `${coin1Value} ${coin1Currency}`;
            break;
        
        case (level <= 4 && !hoardCheck.checked && roll <= 60):
            coin1Value = rollMultiple(4, 6);
            coin1Currency = "SP";
            title.innerHTML = `${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 4 && !hoardCheck.checked && roll <= 70):
            coin1Value = rollMultiple(3, 6);
            coin1Currency = "EP";
            title.innerHTML = `${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 4 && !hoardCheck.checked && roll <= 95):
            coin1Value = rollMultiple(3, 6);
            coin1Currency = "GP";
            title.innerHTML = `${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 4 && !hoardCheck.checked && roll <= 100):
            coin1Value = rollMultiple(1, 6);
            coin1Currency = "PP";
            title.innerHTML = `${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 4 && hoardCheck.checked):
            coin1Value = rollMultiple(6, 6) * 100;
            coin1Currency = "CP";
            coin2Value = rollMultiple(3, 6) * 100;
            coin2Currency = "SP";
            coin3Value = rollMultiple(2, 6) * 10;
            coin3Currency = "GP";
            title.innerHTML = `${coin3Value} ${coin3Currency}, ${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break

        case (level <= 10 && !hoardCheck.checked && roll <= 30):
            coin1Value = rollMultiple(4, 6) * 100;
            coin1Currency = "CP";
            coin2Value = rollMultiple(1, 6) * 10;
            coin2Currency = "EP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 10 && !hoardCheck.checked && roll <= 60):
            coin1Value = rollMultiple(6, 6) * 10;
            coin1Currency = "SP";
            coin2Value = rollMultiple(2, 6) * 10;
            coin2Currency = "GP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 10 && !hoardCheck.checked && roll <= 70):
            coin1Value = rollMultiple(3, 6) * 10;
            coin1Currency = "EP";
            coin2Value = rollMultiple(2, 6) * 10;
            coin2Currency = "GP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 10 && !hoardCheck.checked && roll <= 95):
            coin1Value = rollMultiple(4, 6) * 10;
            coin1Currency = "GP";
            title.innerHTML = `${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 10 && !hoardCheck.checked && roll <= 100):
            coin1Value = rollMultiple(2, 6) * 10;
            coin1Currency = "GP";
            coin2Value = rollMultiple(3, 6);
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 10 && hoardCheck.checked):
            coin1Value = (rollMultiple(2, 6) * 100);
            coin1Currency = "CP";
            coin2Value = (rollMultiple(2, 6) * 1000);
            coin2Currency = "SP";
            coin3Value = (rollMultiple(6, 6) * 100);
            coin3Currency = "GP";
            coin4Value = (rollMultiple(3, 6) * 10);
            coin4Currency = "PP";
            title.innerHTML = `${coin4Value} ${coin4Currency}, ${coin3Value} ${coin3Currency}, ${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 16 && !hoardCheck.checked && roll <= 20):
            coin1Value = rollMultiple(4, 6) * 100;
            coin1Currency = "SP";
            coin2Value = rollMultiple(1, 6) * 100;
            coin2Currency = "GP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 16 && !hoardCheck.checked && roll <= 35):
            coin1Value = rollMultiple(1, 6) * 100;
            coin1Currency = "EP";
            coin2Value = rollMultiple(1, 6) * 100;
            coin2Currency = "GP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 16 && !hoardCheck.checked && roll <= 75):
            coin1Value = rollMultiple(2, 6) * 100;
            coin1Currency = "GP";
            coin2Value = rollMultiple(1, 6) * 10;
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 16 && !hoardCheck.checked && roll <= 100):
            coin1Value = rollMultiple(2, 6) * 100;
            coin1Currency = "GP";
            coin2Value = rollMultiple(2, 6) * 10;
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level <= 16 && hoardCheck.checked):
            coin1Value = (rollMultiple(4, 6) * 1000);
            coin1Currency = "GP";
            coin2Value = (rollMultiple(5, 6) * 100);
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level >= 17 && !hoardCheck.checked && roll <= 15):
            coin1Value = rollMultiple(2, 6) * 1000;
            coin1Currency = "EP";
            coin2Value = rollMultiple(8, 6) * 100;
            coin2Currency = "GP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level >= 17 && !hoardCheck.checked && roll <= 55):
            coin1Value = rollMultiple(1, 6) * 1000;
            coin1Currency = "GP";
            coin2Value = rollMultiple(1, 6) * 100;
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level >= 17 && !hoardCheck.checked && roll <= 100):
            coin1Value = rollMultiple(1, 6) * 1000;
            coin1Currency = "GP";
            coin2Value = rollMultiple(2, 6) * 100;
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;

        case (level >= 17 && hoardCheck.checked):
            coin1Value = (rollMultiple(12, 6) * 1000);
            coin1Currency = "GP";
            coin2Value = (rollMultiple(8, 6) * 1000);
            coin2Currency = "PP";
            title.innerHTML = `${coin2Value} ${coin2Currency} & ${coin1Value} ${coin1Currency}`;
            break;
    };
};

rollBtn.addEventListener('click', rollGold);
