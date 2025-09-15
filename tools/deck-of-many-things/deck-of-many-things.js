const title = document.getElementById('title');
const description = document.getElementById('description');
const infoLink = document.getElementById('info-link');
const balancedRadio = document.getElementById('balanced-radio');
const chaoticRadio = document.getElementById('chaotic-radio');
const drawBtn = document.getElementById('draw-btn');

let deck = [];

fetch('../../json/cards.json')
    .then(response => response.json())
    .then(data => {
        deck = data.deck;
    });

function getBalancedCard(roll) {
    if (roll >= 1 && roll <= 8) return "Euryale";
    if (roll >= 9 && roll <= 16) return "Flames";
    if (roll >= 17 && roll <= 24) return "Jester";
    if (roll >= 25 && roll <= 32) return "Key";
    if (roll >= 33 && roll <= 40) return "Knight";
    if (roll >= 41 && roll <= 48) return "Moon";
    if (roll >= 49 && roll <= 56) return "Rogue";
    if (roll >= 57 && roll <= 64) return "Ruin";
    if (roll >= 65 && roll <= 72) return "Skull";
    if (roll >= 73 && roll <= 80) return "Star";
    if (roll >= 81 && roll <= 88) return "Sun";
    if (roll >= 89 && roll <= 96) return "Throne";
    if (roll >= 97 && roll <= 100) return "Void";
}

function getChaoticCard(roll) {
    if (roll >= 1 && roll <= 5) return "Balance";
    if (roll >= 6 && roll <= 10) return "Comet";
    if (roll >= 11 && roll <= 14) return "Donjon";
    if (roll >= 15 && roll <= 18) return "Euryale";
    if (roll >= 19 && roll <= 23) return "Fates";
    if (roll >= 24 && roll <= 27) return "Flames";
    if (roll >= 28 && roll <= 31) return "Fool";
    if (roll >= 32 && roll <= 36) return "Gem";
    if (roll >= 37 && roll <= 41) return "Jester";
    if (roll >= 42 && roll <= 46) return "Key";
    if (roll >= 47 && roll <= 51) return "Knight";
    if (roll >= 52 && roll <= 56) return "Moon";
    if (roll >= 57 && roll <= 60) return "Puzzle";
    if (roll >= 61 && roll <= 64) return "Rogue";
    if (roll >= 65 && roll <= 68) return "Ruin";
    if (roll >= 69 && roll <= 73) return "Sage";
    if (roll >= 74 && roll <= 77) return "Skull";
    if (roll >= 78 && roll <= 82) return "Star";
    if (roll >= 83 && roll <= 87) return "Sun";
    if (roll >= 88 && roll <= 91) return "Talons";
    if (roll >= 92 && roll <= 96) return "Throne";
    if (roll >= 97 && roll <= 100) return "Void";
}

function drawCard() {
    if (deck.length === 0) {
        title.innerHTML = "Deck Not Loaded";
        description.innerHTML = "Please try again in a moment.";
        return;
    }

    const roll = Math.ceil(Math.random() * 100);

    let selectedName;

    if (balancedRadio.checked) {
        selectedName = getBalancedCard(roll);
    } else if (chaoticRadio.checked) {
        selectedName = getChaoticCard(roll);
    } else {
        title.innerHTML = "No Deck Selected";
        description.innerHTML = "Please choose a deck type.";
        return;
    }

    const card = deck.find(item => item.card === selectedName);

    if (card) {
        title.innerHTML = card.card;
        description.classList.remove('hidden');
        description.innerHTML = card.description;

        if (card.link) {
            infoLink.classList.remove('hidden');
            infoLink.setAttribute('href', card.link);

            // Custom text based on card name:
            if (card.card === "Knight" || card.card === "Skull") {
                infoLink.innerText = "View Statblock";
            } else if (card.card === "Moon") {
                infoLink.innerText = "View Spell";
            } else {
                infoLink.innerText = "Learn More";
            }

        } else {
            infoLink.classList.add('hidden');
            infoLink.removeAttribute('href');
            infoLink.innerText = "";
        }

    } else {
        title.innerHTML = "No Card Found";
        description.innerHTML = "";
        infoLink.classList.add('hidden');
        infoLink.removeAttribute('href');
        infoLink.innerText = "";
    }
}

drawBtn.addEventListener('click', drawCard);
