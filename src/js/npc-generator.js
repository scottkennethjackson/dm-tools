const characterSheet = document.getElementById('character-sheet');
const nameInput = document.getElementById('name-input');
const npcSize = document.getElementById('size');
const npcShape = document.getElementById('shape');
const npcSpecies = document.getElementById('species');
const npcAlignment = document.getElementById('alignment');
const npcAC = document.getElementById('ac');
const armor = document.getElementById('armor');
const npcArmorType = document.getElementById('armor-type');
const npcHP = document.getElementById('hp');
const npcSpeed = document.getElementById('speed');
const npcSTR = document.getElementById('str');
const npcSTRmodifier = document.getElementById('str-modifier');
const npcDEX = document.getElementById('dex');
const npcDEXmodifier = document.getElementById('dex-modifier');
const npcCON = document.getElementById('con');
const npcCONmodifier = document.getElementById('con-modifier');
const npcINT = document.getElementById('int');
const npcINTmodifier = document.getElementById('int-modifier');
const npcWIS = document.getElementById('wis');
const npcWISmodifier = document.getElementById('wis-modifier');
const npcCHA = document.getElementById('cha');
const npcCHAmodifier = document.getElementById('cha-modifier');
const npcSave1 = document.getElementById('save1');
const npcSave1Modifier = document.getElementById('save1-modifier');
const npcSave2 = document.getElementById('save2');
const npcSave2Modifier = document.getElementById('save2-modifier');
const npcSkill1 = document.getElementById('skill1');
const npcSkill1Modifier = document.getElementById('skill1-modifier');
const npcSkill2 = document.getElementById('skill2');
const npcSkill2Modifier = document.getElementById('skill2-modifier');
const dmgResistances = document.getElementById('dmg-resistances');
const npcResistance = document.getElementById('resistance');
const darkvision = document.getElementById('darkvision');
const npcDarkvisionRange = document.getElementById('darkvision-range');
const npcPassivePerception = document.getElementById('passive-perception')
const npcLanguages = document.getElementById('languages');
const npcProficiencyBonus = document.querySelectorAll('.proficiency-bonus');
const traits = document.getElementById('traits');
const trait1 = document.getElementById('trait1');
const trait1Description = document.getElementById('trait1-description');
const subTrait = document.getElementById('sub-trait');
const trait2 = document.getElementById('trait2');
const trait2Description = document.getElementById('trait2-description');
const additionalTraits = document.getElementById('additional-traits');
const trait3 = document.getElementById('trait3');
const trait3Description = document.getElementById('trait3-description');
const trait4 = document.getElementById('trait4');
const trait4Description = document.getElementById('trait4-description');
const actions = document.getElementById('actions');
const multiattack = document.getElementById('multiattack');
const attacker = document.getElementById('attacker');
const multiattackType = document.getElementById('multiattack-type');
const meleeWeapon = document.getElementById('melee-weapon');
const toHit = document.querySelectorAll('.to-hit');
const reach = document.getElementById('reach');
const meleeDice = document.getElementById('melee-dice');
const meleeDmgType = document.getElementById('ranged-dmg-type');
const rangedAttack = document.getElementById('ranged-attack');
const rangedWeapon = document.getElementById('ranged-weapon');
const range = document.getElementById('range');
const rangedDice = document.getElementById('ranged-dice');
const rangedDmgType = document.getElementById('ranged-dmg-type');
const breathWeapon = document.getElementById('breath-weapon');
const breathDmgType = document.querySelectorAll('.breath-dmg-type');
const breathSave = document.getElementById('breath-save');
const breathDice = document.getElementById('breath-dice');
const bonusActions = document.getElementById('bonus-actions');
const bonusName = document.getElementById('bonus-name');
const bonusDescription = document.getElementById('bonus-description');

const title = document.getElementById('title');
// Modifiers
const rollBtn = document.getElementById('roll-btn');

let importedName = localStorage.getItem('generatedName');
let names = { male: [], female: [], surname: [] };
let speciesData = {};

window.addEventListener('DOMContentLoaded', () => {
    title.innerText = importedName 
        ? `Set ${importedName}'s Level` 
        : "Set NPC's Level";
});

Promise.all([
    fetch('../json/names.json').then(res => {
        if (!res.ok) throw new Error("Failed to load names.json");
        return res.json();
    }),
    fetch('../json/species.json').then(res => {
        if (!res.ok) throw new Error("Failed to load species.json");
        return res.json();
    })
])
    .then(([namesData, speciesJson]) => {
        names.male = namesData['first names']?.male.map(obj => obj.name) || [];
        names.female = namesData['first names']?.female.map(obj => obj.name) || [];
        names.surname = namesData.surnames?.map(obj => obj.name) || [];

        for (const speciesInfo of Object.values(speciesJson)) {
            let coreLang = '';
            let additionalLangs = [];

            if (Array.isArray(speciesInfo.languages)) {
                for (const entry of speciesInfo.languages) {
                    if (entry['core languages']) coreLang = entry['core languages'];
                    if (entry['additional language']) {
                        additionalLangs = entry['additional language'].map(l => l.language);
                    }
                }
            } else if (typeof speciesInfo.languages === 'object') {
                coreLang = speciesInfo.languages['core languages'] ?? '';
                additionalLangs = speciesInfo.languages['additional language']?.map(l => l.language) ?? [];
            }

            speciesInfo._coreLanguages = coreLang;
            speciesInfo._additionalLanguages = additionalLangs;
        }

        speciesData = speciesJson;
    })
    .catch(error => {
        console.error("Error loading JSON files:", error);
    });

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function rollName() {
    if (importedName) {
        nameInput.value = importedName;
        localStorage.removeItem('generatedName');
        importedName = undefined;
    } else {
        const isMale = Math.random() < 0.5;
        const firstName = getRandom(isMale ? names.male : names.female);
        const surname = getRandom(names.surname);
        nameInput.value = `${firstName} ${surname}`;
    }
}

function rollSpecies() {
    const speciesList = ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath', 'Halfling', 'Human', 'Orc', 'Tiefling'];
    const species = getRandom(speciesList);
    const speciesInfo = speciesData[species];

    if (!speciesInfo) {
        console.warn(`Species data for "${species}" not found.`);
        return;
    }

    npcSize.textContent = speciesInfo.size || '';
    npcShape.textContent = speciesInfo['creature type'] || '';

    let selectedSubspecies = null;

    if (species === 'Goliath') {
        selectedSubspecies = getRandom(speciesInfo.subspecies);
        npcSpecies.textContent = species || '';
    } else if (Array.isArray(speciesInfo.subspecies) && speciesInfo.subspecies.length > 0) {
        selectedSubspecies = getRandom(speciesInfo.subspecies);
        npcSpecies.textContent = `${selectedSubspecies.type} ${species}` || '';
    } else {
        npcSpecies.textContent = species  || '';
    }

    const speed = selectedSubspecies?.['improved speed'] ?? speciesInfo.speed;
    npcSpeed.textContent = speed  || '';

    let skill1 = selectedSubspecies?.['proficiency'] ?? '';
    npcSkill1.textContent = skill1 || '';

    let dmgResistance = '';

    if (species === 'Dragonborn') {
        const element = selectedSubspecies.element;

        dmgResistances.classList.remove('hidden');
        dmgResistance = element;
        rangedAttack.classList.add('hidden');
        breathWeapon.classList.remove('hidden');
        breathDmgType.forEach((instance) => instance.textContent = element);
    } else if (species === 'Tiefling') {
        dmgResistances.classList.remove('hidden');
        dmgResistance = selectedSubspecies['damage resistance'];
    } else if (speciesInfo['damage resistance']) {
        dmgResistances.classList.remove('hidden');
        dmgResistance = speciesInfo['damage resistance'];
    } else {
        dmgResistances.classList.add('hidden');
    }
    
    npcResistance.textContent = dmgResistance || '';

    let darkvisionRange = 0;

    if (selectedSubspecies?.['improved darkvision']) {
        darkvision.classList.remove('hidden');
        darkvisionRange = selectedSubspecies['improved darkvision'];
    } else if (speciesInfo.darkvision['has darkvision']) {
        darkvision.classList.remove('hidden');
        darkvisionRange = speciesInfo.darkvision.range;
    } else {
        darkvision.classList.add('hidden');
    }
    
    npcDarkvisionRange.textContent = darkvisionRange || '';

    let languages = '';

    const coreLang = selectedSubspecies?.languages?.['core languages']
    ?? speciesInfo._coreLanguages;

    function rollAdditionalLang(exclude = '') {
        const additional = speciesInfo._additionalLanguages;
        if (!additional.length) return '';
        let result;
        do {
            result = additional[Math.floor(Math.random() * additional.length)];
        } while (result === exclude && additional.length > 1);
        return result;
    }

    if (selectedSubspecies?.type === 'Chthonic') {
        languages = coreLang;
    } else if (species === 'Human') {
        const lang2 = rollAdditionalLang();
        const lang3 = rollAdditionalLang(lang2);
    
        if (lang2 && lang3) {
            languages = `${coreLang}, ${lang2} & ${lang3}`;
        } else if (lang2) {
            languages = `${coreLang} & ${lang2}`;
        } else {
            languages = coreLang;
        }
    } else {
        const extraLang = rollAdditionalLang();
        languages = extraLang ? `${coreLang} & ${extraLang}` : coreLang;
    }
    
    npcLanguages.textContent = languages || '';

    if (species === 'Halfling' && Array.isArray(speciesInfo?.traits)) {
        traits.classList.remove('hidden');
        subTrait.classList.remove('hidden');
        additionalTraits.classList.remove('hidden');

        const traitElements = [
            [trait1, trait1Description],
            [trait2, trait2Description],
            [trait3, trait3Description],
            [trait4, trait4Description]
        ];

        traitElements.forEach(([nameElement, descElement], index) => {
            const trait = speciesInfo.traits[index];
            nameElement.textContent = trait?.name || '';
            descElement.textContent = trait?.description || '';
        });
    } else if (species === 'Goliath') {
        traits.classList.remove('hidden');
        subTrait.classList.remove('hidden');
        additionalTraits.classList.add('hidden');

        trait1.textContent = speciesInfo.traits.name || '';
        trait1Description.textContent = speciesInfo.traits.description || '';
        trait2.textContent = selectedSubspecies['subspecies trait'].name || '';
        trait2Description.textContent = selectedSubspecies['subspecies trait'].description || '';
    } else if (speciesInfo?.traits) {
        traits.classList.remove('hidden');
        subTrait.classList.add('hidden');
        additionalTraits.classList.add('hidden');

        trait1.textContent = speciesInfo.traits.name || '';
        trait1Description.textContent = speciesInfo.traits.description || '';
    } else {
        traits.classList.add('hidden');
        subTrait.classList.add('hidden');
        additionalTraits.classList.add('hidden');
    }

    if (speciesInfo?.['bonus action']) {
        bonusActions.classList.remove('hidden');
        bonusName.textContent = speciesInfo['bonus action'].name || '';
        bonusDescription.innerHTML = speciesInfo['bonus action'].description || '';
    } else {
        bonusActions.classList.add('hidden');
    }
}

function rollAlignment() {
    const lawfulness = getRandom(['Chaotic', 'Neutral', 'Lawful']);
    const goodness = getRandom(['Evil', 'Neutral', 'Good']);

    npcAlignment.textContent = 
        lawfulness === goodness ? 'True Neutral' : `${lawfulness} ${goodness}` || '';
}

function rollNPC() {
    title.classList.add('hidden');
    characterSheet.classList.remove('hidden');

    rollName();
    rollSpecies();
    rollAlignment();
}

rollBtn.addEventListener('click', rollNPC);
