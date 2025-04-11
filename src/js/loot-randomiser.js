const title = document.getElementById('title');
const lootLink = document.getElementById('loot-link');
const warning = document.getElementById('warning');
const rollBtn = document.getElementById('roll-btn');

let roll;

fetch('../json/treasure.json')
    .then(response => response.json())
    .then(data => {
        gemstones = data.gemstones;
        trinkets = data.trinkets;
    });

fetch('../json/consumables.json')
    .then(response => response.json())
    .then(data => {
        consumables = data.consumables;
    });

fetch('../json/spells.json')
    .then(response => response.json())
    .then(data => {
        cantrips = data.cantrips;
        level1 = data.level1;
        level2 = data.level2;
        level3 = data.level3;
        level4 = data.level4;
        level5 = data.level5;
        level6 = data.level6;
        level7 = data.level7;
        level8 = data.level8;
        level9 = data.level9;
    });

fetch('../json/magic-items.json')
    .then(response => response.json())
    .then(data => {
        cursed = data.cursed;
        uncommon = data.uncommon;
        rare = data.rare;
        veryRare = data.veryRare;
        legendary = data.legendary;
    });

function rollLoot() {
    warning.classList.add('hidden');

    roll = Math.floor(Math.random() * 7);

    if (roll == 0) {
        console.log(roll)
        title.innerHTML = "You Didn't Find Anything";
        lootLink.classList.add('hidden');
    };

    if (roll == 1) {
        console.log(roll);
        roll = Math.floor(Math.random() * gemstones.length);
        title.innerHTML = gemstones[roll].name;
        lootLink.classList.add('hidden');
    };

    if (roll == 2) {
        console.log(roll);
        roll = Math.floor(Math.random() * trinkets.length);
        title.innerHTML = trinkets[roll].name;
        lootLink.classList.add('hidden');
    };

    if (roll == 3) {
        console.log(roll);
        roll = Math.floor(Math.random() * consumables.length);
        title.innerHTML = consumables[roll].name;
        lootLink.innerHTML = 'View Item';
        lootLink.setAttribute('href', `${consumables[roll].link}`);
        lootLink.classList.remove('hidden');
    };

    if (roll == 4) {
        console.log(roll);
        roll = Math.ceil(Math.random() * 4);

        if (roll == 1) {
            title.innerHTML = `${roll} Potion of Healing`;
        } else {
            title.innerHTML = `${roll} Potions of Healing`;
        }

        lootLink.innerHTML = 'View Item';
        lootLink.setAttribute('href', 'https://www.dndbeyond.com/magic-items/8960641-potion-of-healing');
        lootLink.classList.remove('hidden');
    };

    if (roll == 5) {
        console.log(roll);
        roll = Math.floor(Math.random() * 10);

        if (roll == 0) {
            title.innerHTML = `Spell Scroll, Cantrip: ${cantrips[roll].name}`;
            lootLink.setAttribute('href', `${cantrips[roll].link}`);
        };

        if (roll == 1) {
            title.innerHTML = `Spell Scroll, 1st Level: ${level1[roll].name}`;
            lootLink.setAttribute('href', `${level1[roll].link}`);
        };

        if (roll == 2) {
            title.innerHTML = `Spell Scroll, 2nd Level: ${level2[roll].name}`;
            lootLink.setAttribute('href', `${level2[roll].link}`);
        };

        if (roll == 3) {
            title.innerHTML = `Spell Scroll, 3rd Level: ${level3[roll].name}`;
            lootLink.setAttribute('href', `${level3[roll].link}`);
        };

        if (roll == 4) {
            title.innerHTML = `Spell Scroll, 4th Level: ${level4[roll].name}`;
            lootLink.setAttribute('href', `${level4[roll].link}`);
        };

        if (roll == 5) {
            title.innerHTML = `Spell Scroll, 5th Level: ${level5[roll].name}`;
            lootLink.setAttribute('href', `${level5[roll].link}`);
        };

        if (roll == 6) {
            title.innerHTML = `Spell Scroll, 6th Level: ${level6[roll].name}`;
            lootLink.setAttribute('href', `${level6[roll].link}`);
        };

        if (roll == 7) {
            title.innerHTML = `Spell Scroll, 7th Level: ${level7[roll].name}`;
            lootLink.setAttribute('href', `${level7[roll].link}`);
        };

        if (roll == 8) {
            title.innerHTML = `Spell Scroll, 8th Level: ${level8[roll].name}`;
            lootLink.setAttribute('href', `${level8[roll].link}`);
        };

        if (roll == 9) {
            title.innerHTML = `Spell Scroll, 9th Level: ${level9[roll].name}`;
            lootLink.setAttribute('href', `${level9[roll].link}`);
        };
        
        lootLink.innerHTML = 'View Spell';
        lootLink.classList.remove('hidden');
    };

    if (roll == 6) {
        console.log(roll);
        roll = Math.floor(Math.random() * 31);

        if (roll == 0) {
            roll = Math.floor(Math.random() * cursed.length);
            title.innerHTML = cursed[roll].name;
            lootLink.setAttribute('href', `${cursed[roll].link}`);
        } else if (roll <= 16) {
            roll = Math.floor(Math.random() * uncommon.length);
            title.innerHTML = uncommon[roll].name;
            lootLink.setAttribute('href', `${uncommon[roll].link}`);
        } else if (roll <= 25) {
            roll = Math.floor(Math.random() * rare.length);
            title.innerHTML = rare[roll].name;
            lootLink.setAttribute('href', `${rare[roll].link}`);
        } else if (roll <= 29) {
            roll = Math.floor(Math.random() * veryRare.length);
            title.innerHTML = veryRare[roll].name;
            lootLink.setAttribute('href', `${veryRare[roll].link}`);
        } else {
            roll = Math.floor(Math.random() * legendary.length);
            title.innerHTML = legendary[roll].name;
            lootLink.setAttribute('href', `${leg[roll].link}`);
        };

        lootLink.innerHTML = 'View Item';
        lootLink.classList.remove('hidden');
    };
};

rollBtn.addEventListener('click', rollLoot);