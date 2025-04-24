const nameInput = document.getElementById('name-input');
const npcSize = document.querySelector('.size');
const npcShape = document.querySelector('.shape');
const npcSpecies = document.querySelector('.species');
const npcAlignment = document.querySelector('.alignment');

// Break
const title = document.getElementById('title');
const rollBtn = document.getElementById('roll-btn');

let importedName = localStorage.getItem('generatedName') || undefined;

window.addEventListener('DOMContentLoaded', () => {
    if (importedName !== undefined) {
        title.innerText = `Set ${importedName}'s Level`;
    } else {
        title.innerText = "Set NPC's Level";
    }
});

const names = {
    male: [],
    female: [],
    surname: []
};

fetch('../json/names.json')
    .then(response => {
        if (!response.ok) throw new Error("Failed to load names.json");
        return response.json();
    })
    .then(data => {
        names.male = data['first names']?.male.map(obj => obj.name) || [];
        names.female = data['first names']?.female.map(obj => obj.name) || [];
        names.surname = data.surnames?.map(obj => obj.name) || [];
    })    
    .catch(error => {
        console.error("Error loading names.json:", error);
    });

let speciesData = {};

fetch('../json/species.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load species.json');
        return response.json();
    })
    .then(data => {
        speciesData = data;
    })
    .catch(error => {
        console.error('Error loading species.json:', error);
    });
    
    
function rollStats() {
    title.classList.add('hidden');

    // Get NPC name
    if (importedName !== undefined) {
        nameInput.value = importedName;
        localStorage.removeItem('generatedName');
        importedName = undefined;
    } else {
        const gender = Math.round(Math.random());

        const firstName = gender === 0 
            ? names.male[Math.floor(Math.random() * names.male.length)] 
            : names.female[Math.floor(Math.random() * names.female.length)];

        const surname = names.surname[Math.floor(Math.random() * names.surname.length)];

        nameInput.value = `${firstName} ${surname}`;
    }

    // Get NPC species & alignment
    const speciesRoll = Math.floor(Math.random() * 9);
    let species;
    
    switch (speciesRoll) {
        case 0: species = 'Dragonborn'; break;
        case 1: species = 'Dwarf'; break;
        case 2: species = 'Elf'; break;
        case 3: species = 'Gnome'; break;
        case 4: species = 'Goliath'; break;
        case 5: species = 'Halfling'; break;
        case 6: species = 'Human'; break;
        case 7: species = 'Orc'; break;
        case 8: species = 'Tiefling'; break;
    }

    const speciesInfo = speciesData[species];
    if (speciesInfo) {
        const size = speciesInfo.size;
        const shape = speciesInfo['creature type'];

        npcSize.innerHTML = `${size}`
        npcShape.innerHTML = `${shape}`

        if (speciesInfo.subspecies) {
            const subspeciesRoll = Math.floor(Math.random() * speciesInfo.subspecies.length);
            npcSpecies.innerHTML = `${speciesInfo.subspecies[subspeciesRoll].type} ${species}`;
        } else {
            npcSpecies.innerHTML = `${species}`;
        }
    } else {
        console.warn(`Species data for "${species}" not found.`);
    }

    // Get NPC alignment
    const lawfulnessRoll = Math.floor(Math.random() * 3);
    const goodnessRoll = Math.floor(Math.random() * 3);

    switch (lawfulnessRoll) {
        case 0: lawfulness = 'Chaotic'; break;
        case 1: lawfulness = 'Neutral'; break;
        case 2: lawfulness = 'Lawful'; break;
    }

    switch (goodnessRoll) {
        case 0: goodness = 'Evil'; break;
        case 1: goodness = 'Neutral'; break;
        case 2: goodness = 'Good'; break;
    }

    if (lawfulness === goodness) npcAlignment.innerHTML = 'True Netural';
    else npcAlignment.innerHTML = `${lawfulness} ${goodness}`
}

rollBtn.addEventListener('click', rollStats);
    