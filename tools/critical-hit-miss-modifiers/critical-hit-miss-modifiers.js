const title = document.getElementById("title");
const description = document.getElementById("description");
const hit = document.getElementById("hit-radio");
const miss = document.getElementById("miss-radio");
const melee = document.getElementById("melee-radio");
const ranged = document.getElementById("ranged-radio");
const spell = document.getElementById("spell-radio");
const rollBtn = document.getElementById("roll-btn");

let effectsArray = [];

fetch("../../json/critical-hit-miss-modifiers.json")
    .then((response) => response.json())
    .then((data) => {
        effectsArray = data;
    })
    .catch((error) => console.error("Error loading effects data:", error));

rollBtn.addEventListener("click", function () {
    title.classList.remove("text-3xl");
    title.classList.add("text-2xl");
    description.classList.remove("hidden");
    
    const roll = Math.ceil(Math.random() * 100);

    const status = hit.checked ? "hit" : miss.checked ? "miss" : null;
    const type = melee.checked ? "melee" : ranged.checked ? "ranged" : spell.checked ? "spell" : null;

    if (!status || !type) {
        title.textContent = "Please select hit or miss and melee, ranged, or spell.";
        description.textContent = "";
        return;
    }

    const getEffect = (statusKey, typeKey) => {
        const statusArray = effectsArray[statusKey];
        if (!statusArray) return;

        const typeObj = statusArray.find((entry) => entry[typeKey]);
        if (!typeObj || !typeObj[typeKey]) return;

        const effect = typeObj[typeKey].find(
            (entry) => roll >= entry.min && roll <= entry.max
        );
    
        if (effect) {
            title.textContent = effect.effect;
            description.textContent = effect.description;
        } else {
            title.textContent = "No Effect Found";
            description.textContent = `No matching effect found for roll ${roll}`;
            console.warn("Roll outside expected range:", roll);
        }
    }

    getEffect(status, type);
});
    
