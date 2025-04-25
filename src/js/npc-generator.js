const characterSheet = document.getElementById('character-sheet');
const nameInput = document.getElementById('name-input');
const npcSize = document.querySelector('.size');
const npcShape = document.querySelector('.shape');
const npcSpecies = document.querySelector('.species');
const npcAlignment = document.querySelector('.alignment');
const npcSpeed = document.querySelector('.speed');
// Break
const npcSkill1 = document.querySelector('.skill1');
const npcSkill2 = document.querySelector('.skill2');
const displayDmgResistance = document.getElementById('display-dmg-resistance');
const npcDmgResistance = document.querySelector('.dmg-resistance');
const displayDarkvision = document.getElementById('display-darkvision');
const npcDarkvision = document.querySelector('.darkvision');
// Break
const npcLanguages = document.querySelector('.languages');
// Break
const traits = document.getElementById('traits');
const trait0Name = document.querySelector('.trait0-name');
const trait0Description = document.querySelector('.trait0-description');
const subTrait = document.getElementById('sub-trait');
const additionalTraits = document.getElementById('additional-traits');
const trait1Name = document.querySelector('.trait1-name');
const trait1Description = document.querySelector('.trait1-description');
const trait2Name = document.querySelector('.trait2-name');
const trait2Description = document.querySelector('.trait2-description');
const trait3Name = document.querySelector('.trait3-name');
const trait3Description = document.querySelector('.trait3-description');
// Break
const bonusActions = document.getElementById('bonus-actions');
const bonusName = document.querySelector('.bonus-name');
const bonusDescription = document.querySelector('.bonus-description');
// Break
const title = document.getElementById('title');
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

function rollStats() {
    title.classList.add('hidden');
    characterSheet.classList.remove('hidden');

    // Name generation
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

    // Species-based stats
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
        displayDmgResistance.classList.remove('hidden');
        dmgResistance = selectedSubspecies.element;
    } else if (species === 'Tiefling') {
        displayDmgResistance.classList.remove('hidden');
        dmgResistance = selectedSubspecies['damage resistance'];
    } else if (speciesInfo['damage resistance']) {
        displayDmgResistance.classList.remove('hidden');
        dmgResistance = speciesInfo['damage resistance'];
    } else {
        displayDmgResistance.classList.add('hidden');
    }
    
    npcDmgResistance.textContent = dmgResistance || '';

    let darkvisionRange = 0;

    if (selectedSubspecies?.['improved darkvision']) {
        displayDarkvision.classList.remove('hidden');
        darkvisionRange = selectedSubspecies['improved darkvision'];
    } else if (speciesInfo.darkvision['has darkvision']) {
        displayDarkvision.classList.remove('hidden');
        darkvisionRange = speciesInfo.darkvision.range;
    } else {
        displayDarkvision.classList.add('hidden');
    }
    
    npcDarkvision.textContent = darkvisionRange || '';

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
            [trait0Name, trait0Description],
            [trait1Name, trait1Description],
            [trait2Name, trait2Description],
            [trait3Name, trait3Description],
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

        trait0Name.textContent = speciesInfo.traits.name || '';
        trait0Description.textContent = speciesInfo.traits.description || '';
        trait1Name.textContent = selectedSubspecies['subspecies trait'].name || '';
        trait1Description.textContent = selectedSubspecies['subspecies trait'].description || '';
    } else if (speciesInfo?.traits) {
        traits.classList.remove('hidden');
        subTrait.classList.add('hidden');
        additionalTraits.classList.add('hidden');

        trait0Name.textContent = speciesInfo.traits.name || '';
        trait0Description.textContent = speciesInfo.traits.description || '';
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
        
    // Alignment
    const lawfulness = getRandom(['Chaotic', 'Neutral', 'Lawful']);
    const goodness = getRandom(['Evil', 'Neutral', 'Good']);

    npcAlignment.textContent = 
        lawfulness === goodness ? 'True Neutral' : `${lawfulness} ${goodness}` || '';
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

rollBtn.addEventListener('click', rollStats);
