const title = document.getElementById('title');
const levelSelector = document.getElementById('level-selector');
const chaosCheck = document.getElementById('chaos-check');
const spellLink = document.getElementById('spell-link');
const rollBtn = document.getElementById('roll-btn');

let spellLevels = {};  // Holds all levels including cantrips

fetch('../json/spells.json')
    .then(response => response.json())
    .then(data => {
        spellLevels = {
            0: data.cantrips,
            1: data['1st level'],
            2: data['2nd level'],
            3: data['3rd level'],
            4: data['4th level'],
            5: data['5th level'],
            6: data['6th level'],
            7: data['7th level'],
            8: data['8th level'],
            9: data['9th level']
        };
    });

function getOrdinalSuffix(level) {
    if (level === 1) return 'st';
    if (level === 2) return 'nd';
    if (level === 3) return 'rd';
    return 'th';
}

function rollSpell() {
    let spellList, spellLevel;

    if (chaosCheck.checked) {
        const levelRoll = Math.floor(Math.random() * 10);
        spellList = spellLevels[levelRoll];
        spellLevel = (levelRoll === 0) ? 'Cantrip' : `${levelRoll}${getOrdinalSuffix(levelRoll)} Level`;

    } else {
        const level = parseInt(levelSelector.value);

        if (spellLevels.hasOwnProperty(level)) {
            spellList = spellLevels[level];
            spellLevel = (level === 0) ? 'Cantrip' : `${level}${getOrdinalSuffix(level)} Level`;
        } else {
            title.innerHTML = "Invalid Spell Level";
            spellLink.classList.add('hidden');
            return;
        }
    }

    if (spellList && spellList.length > 0) {
        const pick = spellList[Math.floor(Math.random() * spellList.length)];
        title.innerHTML = `${pick.name} (${spellLevel})`;
        spellLink.href = pick.link;
        spellLink.classList.remove('hidden');
    } else {
        title.innerHTML = "No Spells Available";
        spellLink.classList.add('hidden');
    }
}

rollBtn.addEventListener('click', rollSpell);
