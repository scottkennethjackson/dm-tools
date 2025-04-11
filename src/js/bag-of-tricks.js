const title = document.getElementById('title');
const beastLink = document.getElementById('beast-link');
const walkingRadio = document.getElementById('walking-radio');
const flyingRadio = document.getElementById('flying-radio');
const swimmingRadio = document.getElementById('swimming-radio');
const rollBtn = document.getElementById('roll-btn');

let roll;

fetch('../json/beasts.json')
    .then(response => response.json())
    .then(beasts => {
        walking = beasts.walking;
        flying = beasts.flying;
        swimming = beasts.swimming;
    });

function rollBeast() {
    beastLink.classList.remove('hidden');

    if (walkingRadio.checked) {
        roll = Math.floor(Math.random() * walking.length);
        title.innerHTML = walking[roll].name;
        beastLink.setAttribute('href', `${walking[roll].link}`);
    };

    if (flyingRadio.checked) {
        roll = Math.floor(Math.random() * flying.length);
        title.innerHTML = flying[roll].name;
        beastLink.setAttribute('href', `${flying[roll].link}`);
    };

    if (swimmingRadio.checked) {
        roll = Math.floor(Math.random() * swimming.length);
        title.innerHTML = swimming[roll].name;
        beastLink.setAttribute('href', `${swimming[roll].link}`);
    };
};

rollBtn.addEventListener('click', rollBeast);
