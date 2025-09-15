const title = document.getElementById('title');
const description = document.getElementById('description');
const rollBtn = document.getElementById('roll-btn');

let effectsArray = [];

fetch("../../json/wild-magic.json")
    .then((response) => response.json())
    .then((data) => {
        effectsArray = data;
    })
    .catch((error) => console.error("Error loading effects data:", error));

rollBtn.addEventListener("click", function () {
    title.textContent = "What Happens:"
    description.classList.remove("hidden");

    const roll = Math.ceil(Math.random() * 100);

    const effect = effectsArray.find(
        (entry) => roll >= entry.min && roll <= entry.max
    );

    if (effect) {
        description.textContent = effect.description;
    } else {
        title.textContent = "No Effect Found"
        description.textContent = "Please try again";

        console.warn("Roll outside range (1-100):", roll);
    }
});
