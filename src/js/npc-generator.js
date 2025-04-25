const title = document.getElementById('title');
const nameInput = document.getElementById('name-input');
const rollBtn = document.getElementById('roll-btn');
const npcSize = document.querySelector('.size');
const npcShape = document.querySelector('.shape');
const npcSpecies = document.querySelector('.species');
const npcAlignment = document.querySelector('.alignment');

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
    names.male = namesData['first names']?.male.map(n => n.name) || [];
    names.female = namesData['first names']?.female.map(n => n.name) || [];
    names.surname = namesData.surnames?.map(n => n.name) || [];
    speciesData = speciesJson;
})
.catch(error => {
    console.error("Error loading JSON files:", error);
});

function rollStats() {
    title.classList.add('hidden');

    if (importedName) {
        nameInput.value = importedName;
        localStorage.removeItem('generatedName');
        importedName = undefined;
    } else {
        const isMale = Math.random() < 0.5;
        const firstName = isMale
            ? getRandom(names.male)
            : getRandom(names.female);
        const surname = getRandom(names.surname);
        nameInput.value = `${firstName} ${surname}`;
    }

    const speciesList = ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath', 'Halfling', 'Human', 'Orc', 'Tiefling'];
    const species = getRandom(speciesList);
    const speciesInfo = speciesData[species];

    if (speciesInfo) {
        npcSize.textContent = speciesInfo.size;
        npcShape.textContent = speciesInfo['creature type'];

        if (species === 'Goliath') {
            npcSpecies.textContent = species;
        } else if (speciesInfo.subspecies?.length) {
            const sub = getRandom(speciesInfo.subspecies).type;
            npcSpecies.textContent = `${sub} ${species}`;
        } else {
            npcSpecies.textContent = species;
        }
    } else {
        console.warn(`Species data for "${species}" not found.`);
    }

    const lawfulness = getRandom(['Chaotic', 'Neutral', 'Lawful']);
    const goodness = getRandom(['Evil', 'Neutral', 'Good']);

    npcAlignment.textContent = 
        lawfulness === goodness ? 'True Neutral' : `${lawfulness} ${goodness}`;
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

rollBtn.addEventListener('click', rollStats);
