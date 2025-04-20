const title = document.getElementById('title');
const beastLink = document.getElementById('beast-link');
const walkingRadio = document.getElementById('walking-radio');
const flyingRadio = document.getElementById('flying-radio');
const swimmingRadio = document.getElementById('swimming-radio');
const rollBtn = document.getElementById('roll-btn');

let beasts = {
    walking: [],
    flying: [],
    swimming: []
};

fetch('../json/beasts.json')
    .then(response => response.json())
    .then(data => {
        beasts.walking = data.walking;
        beasts.flying = data.flying;
        beasts.swimming = data.swimming;
    });

function rollBeast() {
    beastLink.classList.remove('hidden');

    let type = null;
    if (walkingRadio.checked) type = 'walking';
    else if (flyingRadio.checked) type = 'flying';
    else if (swimmingRadio.checked) type = 'swimming';

    if (!type || beasts[type].length === 0) {
        title.innerHTML = "No beast found. Please try again.";
        beastLink.classList.add('hidden');
        return;
    }

    const randomIndex = Math.floor(Math.random() * beasts[type].length);
    const selectedBeast = beasts[type][randomIndex];

    title.innerHTML = selectedBeast.name;
    beastLink.setAttribute('href', selectedBeast.link);
}

rollBtn.addEventListener('click', rollBeast);
