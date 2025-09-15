const title = document.getElementById('title');
const statblockLink = document.getElementById('statblock-link');
const masculineRadio = document.getElementById('masculine-radio');
const feminineRadio = document.getElementById('feminine-radio');
const rollBtn = document.getElementById('roll-btn');

const names = {
    male: [],
    female: [],
    surname: []
};

fetch('../../json/names.json')
    .then(response => {
        if (!response.ok) throw new Error("Failed to load names.json");
        return response.json();
    })
    .then(data => {
        names.male = data['first names']?.male || [];
        names.female = data['first names']?.female || [];
        names.surname = data.surnames || [];
    })
    .catch(error => {
        console.error("Error loading names:", error);
        title.innerHTML = "Failed to Load Names";
    });

function getRandomName(list) {
    if (!Array.isArray(list) || list.length === 0) return "Unknown";
    const index = Math.floor(Math.random() * list.length);
    return list[index].name || "Unnamed";
}

function rollName() {
    if (names.male.length === 0 && names.female.length === 0 && names.surname.length === 0) {
        title.innerHTML = "Names not loaded. Please try again in a moment.";
        return;
    }

    let firstName = "Unnamed";

    if (masculineRadio.checked) {
        firstName = getRandomName(names.male);
    } else if (feminineRadio.checked) {
        firstName = getRandomName(names.female);
    } else {
        title.innerHTML = "Please Select an Adjective";
        return;
    }

    const surname = getRandomName(names.surname);
    const fullName = `${firstName} ${surname}`;

    title.innerHTML = `${fullName}`;
    statblockLink.classList.remove('hidden');

    localStorage.setItem('generatedName', fullName);
}

rollBtn.addEventListener('click', rollName);
