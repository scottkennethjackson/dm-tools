const instructions = document.getElementById("instructions");
const combatants = document.getElementById("combatants");
const combatantModifiers = document.getElementById("combatant-modifiers");
const addBtn = document.getElementById("add-btn");
const minusBtn = document.getElementById("minus-btn");
const minusSymbol = document.getElementById("minus-symbol");
const nextBtn = document.getElementById("next-btn");
const sortBtn = document.getElementById("sort-btn");

const inactiveClasses = ["bg-gray-400", "cursor-not-allowed"];
const activeClasses = ["bg-red", "active:brightness-90", "cursor-pointer"];

let combatantCount = 2;

addBtn.addEventListener("click", () => {
    combatantCount++;

    minusBtn.classList.remove(...inactiveClasses);
    minusBtn.classList.add(...activeClasses);
    minusSymbol.classList.remove("fill-gray-600");
    minusSymbol.classList.add("fill-white");

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.id = `combatant${combatantCount}`;
    newInput.name = `combatant${combatantCount}`;
    newInput.placeholder = `Combatant #${combatantCount}`;
    newInput.className = "p-1 text-center text-black bg-gray-100";

  combatants.appendChild(newInput);
});

minusBtn.addEventListener("click", () => {
    if (combatantCount > 2) {
        const lastInput = document.getElementById(`combatant${combatantCount}`);
        if (lastInput) {
            combatants.removeChild(lastInput);
            combatantCount--;
        }
    } else {
        minusBtn.classList.remove(...activeClasses);
        minusBtn.classList.add(...inactiveClasses);
        minusSymbol.classList.remove("fill-white");
        minusSymbol.classList.add("fill-gray-600");
    }
});

nextBtn.addEventListener("click", () => {
    combatants.classList.add("justify-between", "w-2/3");
    combatantModifiers.classList.add("hidden");
    nextBtn.classList.add("hidden");
    sortBtn.classList.remove("hidden");

    instructions.textContent = "Input initiative roll values"

    const inputs = combatants.querySelectorAll("input[type='text']");

    inputs.forEach((input, index) => {
        const name = input.value || `Combatant #${index + 1}`;

        const wrapper = document.createElement("div");
        wrapper.className = "flex justify-between";

        const nameP = document.createElement("p");
        nameP.className = "font-tiamat text-xl";
        nameP.textContent = name;

        const numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.id = input.id;
        numberInput.name = input.name;
        numberInput.className = "w-12 p-1 text-center text-black bg-gray-100";
        numberInput.min = 1;
        numberInput.value = 1;

        wrapper.appendChild(nameP);
        wrapper.appendChild(numberInput);

        combatants.replaceChild(wrapper, input);
    });
});
