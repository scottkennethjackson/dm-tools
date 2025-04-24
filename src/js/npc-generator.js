const importedName = localStorage.getItem('generatedName') || undefined;
const title = document.getElementById('title');
const nameInput = document.getElementById('name-input');
const names = {
    male: [],
    female: [],
    surname: []
};
const rollBtn = document.getElementById('roll-btn');

window.addEventListener('DOMContentLoaded', () => {
    if (importedName !== undefined) {
        title.innerText = `Select ${importedName}'s Level`;
    } else {
        title.innerText = "Select NPC's Level";
    }
});

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
        console.error("Error loading names:", error);
        title.innerHTML = "Failed to Load Names";
    });

function rollStats() {
    title.classList.add('hidden');
    localStorage.removeItem('generatedName');

    if (importedName !== undefined) {
        nameInput.value = importedName;
    } else {
        const gender = Math.round(Math.random());

        const firstName = gender === 0 
            ? names.male[Math.floor(Math.random() * names.male.length)] 
            : names.female[Math.floor(Math.random() * names.female.length)];

        const surname = names.surname[Math.floor(Math.random() * names.surname.length)];

        nameInput.value = `${firstName} ${surname}`;
    }

    importedName = undefined;
}

rollBtn.addEventListener('click', rollStats);
