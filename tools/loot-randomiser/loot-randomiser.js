const title = document.getElementById('title');
const lootLink = document.getElementById('loot-link');
const rollBtn = document.getElementById('roll-btn');

let trinkets = [], gemstones = [], valuables = [], consumables = [];
let cantrips = [], level1 = [], level2 = [], level3 = [], level4 = [], level5 = [],
    level6 = [], level7 = [], level8 = [], level9 = [];
let cursed = [], uncommon = [], rare = [], veryRare = [], legendary = [];

Promise.all([
    fetch('../../json/treasure.json').then(r => r.json()),
    fetch('../../json/consumables.json').then(r => r.json()),
    fetch('../../json/spells.json').then(r => r.json()),
    fetch('../../json/magic-items.json').then(r => r.json())
]).then(([treasure, consumableData, spells, magicItems]) => {
    trinkets = treasure.trinkets;
    gemstones = treasure.gemstones;
    valuables = treasure.valuables;
    consumables = consumableData.consumables;

    cantrips = spells.cantrips;
    level1 = spells['1st level'];
    level2 = spells['2nd level'];
    level3 = spells['3rd level'];
    level4 = spells['4th level'];
    level5 = spells['5th level'];
    level6 = spells['6th level'];
    level7 = spells['7th level'];
    level8 = spells['8th level'];
    level9 = spells['9th level'];

    cursed = magicItems.cursed;
    uncommon = magicItems.uncommon;
    rare = magicItems.rare;
    veryRare = magicItems['very rare'];
    legendary = magicItems.legendary;
});

function rollLoot() {
    let lootRoll = Math.floor(Math.random() * 8);

    lootLink.classList.add('hidden'); // Default to hidden

    if (lootRoll === 0) {
        title.innerHTML = "You Didn't Find Anything";
        return;
    }

    if (lootRoll === 1) {
        const pick = trinkets[Math.floor(Math.random() * trinkets.length)];
        title.innerHTML = pick.name;
    }

    else if (lootRoll === 2) {
        const pick = gemstones[Math.floor(Math.random() * gemstones.length)];
        title.innerHTML = pick.name;
    }

    else if (lootRoll === 3) {
        const pick = valuables[Math.floor(Math.random() * valuables.length)];
        title.innerHTML = pick.name;
    }

    else if (lootRoll === 4) {
        const pick = consumables[Math.floor(Math.random() * consumables.length)];
        title.innerHTML = pick.name;
        lootLink.innerHTML = 'View Item';
        lootLink.href = pick.link;
        lootLink.classList.remove('hidden');
    }

    else if (lootRoll === 5) {
        const quantity = Math.ceil(Math.random() * 4);
        title.innerHTML = quantity === 1 ? `Potion of Healing` : `${quantity} Potions of Healing`;
        lootLink.innerHTML = 'View Item';
        lootLink.href = 'https://www.dndbeyond.com/magic-items/8960641-potion-of-healing';
        lootLink.classList.remove('hidden');
    }

    else if (lootRoll === 6) {
        const levelRoll = Math.floor(Math.random() * 10);
        let spellList, spellLevel;

        switch (levelRoll) {
            case 0: spellList = cantrips; spellLevel = 'Cantrip'; break;
            case 1: spellList = level1; spellLevel = '1st Level'; break;
            case 2: spellList = level2; spellLevel = '2nd Level'; break;
            case 3: spellList = level3; spellLevel = '3rd Level'; break;
            case 4: spellList = level4; spellLevel = '4th Level'; break;
            case 5: spellList = level5; spellLevel = '5th Level'; break;
            case 6: spellList = level6; spellLevel = '6th Level'; break;
            case 7: spellList = level7; spellLevel = '7th Level'; break;
            case 8: spellList = level8; spellLevel = '8th Level'; break;
            case 9: spellList = level9; spellLevel = '9th Level'; break;
        }

        const pick = spellList[Math.floor(Math.random() * spellList.length)];
        title.innerHTML = `Spell Scroll, ${spellLevel}: ${pick.name}`;
        lootLink.innerHTML = 'View Spell';
        lootLink.href = pick.link;
        lootLink.classList.remove('hidden');
    }

    else if (lootRoll === 7) {
        const rarityRoll = Math.floor(Math.random() * 31);
        let category;

        if (rarityRoll === 0) category = cursed;
        else if (rarityRoll <= 16) category = uncommon;
        else if (rarityRoll <= 25) category = rare;
        else if (rarityRoll <= 29) category = veryRare;
        else category = legendary;

        const pick = category[Math.floor(Math.random() * category.length)];
        title.innerHTML = pick.name;
        lootLink.innerHTML = 'View Item';
        lootLink.href = pick.link;
        lootLink.classList.remove('hidden');
    }
}

rollBtn.addEventListener('click', rollLoot);
