const winner = document.getElementById("winner");
const instructions = document.getElementById("instructions");
const combatants = document.getElementById("combatants");
const combatantModifiers = document.getElementById("combatant-modifiers");
const addBtn = document.getElementById("add-btn");
const minusBtn = document.getElementById("minus-btn");
const minusSymbol = document.getElementById("minus-symbol");
const carousel = document.getElementById("carousel");
const slideTrack = document.getElementById("slide-track");
const nextCombatant = document.getElementById("next-combatant");
const nextBtn = document.getElementById("next-btn");
const resetInitiative = document.getElementById("reset-initiative");

const inactiveClasses = ["bg-gray-400", "cursor-not-allowed"];
const activeClasses = ["bg-red", "active:brightness-90", "cursor-pointer"];

let combatantsList = [];
let combatantCount = 2;
let totalSlides = 0;
let isSliding = false;

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

            if (combatantCount === 2) {
                minusBtn.classList.remove(...activeClasses);
                minusBtn.classList.add(...inactiveClasses);
                minusSymbol.classList.remove("fill-white");
                minusSymbol.classList.add("fill-gray-600");
            }
        }
    }
});

nextBtn.addEventListener("click", createCombatants);

function createCombatants() {
    nextBtn.removeEventListener("click", createCombatants);
    setTimeout(() => {
        nextBtn.addEventListener("click", sortCombatants);
    }, 500);
    
    instructions.textContent = "Roll for initiative & input results";
    combatantModifiers.classList.add("hidden");
    nextBtn.textContent = "Sort";

    combatantsList = [];

    const inputs = combatants.querySelectorAll("input[type='text']");

    inputs.forEach((input, index) => {
        const name = input.value || `Combatant #${index + 1}`;
        const uniqueId = crypto.randomUUID();

        combatantsList.push({
            id: uniqueId,
            name,
            value: 1,
            dex: null,
        });

        const wrapper = document.createElement("div");
        wrapper.className = "flex justify-between";
        wrapper.dataset.id = uniqueId;

        const nameP = document.createElement("p");
        nameP.className = "font-tiamat text-xl";
        nameP.textContent = name;
        nameP.dataset.id = uniqueId;

        const numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.className = "w-12 p-1 text-center text-black bg-gray-100";
        numberInput.min = 1;
        numberInput.value = 1;
        numberInput.dataset.id = uniqueId;

        wrapper.appendChild(nameP);
        wrapper.appendChild(numberInput);

        combatants.replaceChild(wrapper, input);
    });
}

function sortCombatants() {
    nextBtn.removeEventListener("click", sortCombatants);

    combatants.querySelectorAll("div").forEach(wrapper => {
        const id = wrapper.dataset.id;
        const value = parseInt(wrapper.querySelector("input[type='number']").value, 10) || 0;

        const combatant = combatantsList.find(c => c.id === id);
        if (combatant) {
            combatant.value = value;
        }
    });

    combatantsList.sort((a, b) => b.value - a.value);

    const duplicatesMap = new Map();
    combatantsList.forEach(c => {
        if (!duplicatesMap.has(c.value)) duplicatesMap.set(c.value, []);
        duplicatesMap.get(c.value).push(c);
    });

    const duplicateGroups = Array.from(duplicatesMap.values()).filter(g => g.length > 1);

    if (duplicateGroups.length > 0) {
        resolveDexTies(duplicateGroups, combatantsList);
    } else {
        const naturalQueue = combatantsList.filter(c => c.value === 20);

        let buttonArea = document.getElementById("instruction-buttons");

        if (!buttonArea) {
            buttonArea = document.createElement("div");
            buttonArea.id = "instruction-buttons";
            buttonArea.className = "flex justify-center w-2/3 space-x-4";
            instructions.parentNode.insertBefore(buttonArea, instructions.nextSibling);
        }

        buttonArea.innerHTML = "";

        processNaturalQueue(naturalQueue, combatantsList, buttonArea);
    }
}

function resolveDexTies(groups) {
    instructions.textContent = "Input DEX values for duplicate rolls";
    combatants.classList.add("hidden");
    nextBtn.textContent = "Confirm";

    setTimeout(() => {
        nextBtn.addEventListener("click", confirmDex)
    }, 500);

    const confirmDex = () => {
        nextBtn.removeEventListener("click", confirmDex);

        const dexInputs = document.querySelectorAll("#dex-area div");
    
        dexInputs.forEach(row => {
            const id = row.dataset.id;
            const dexValue = parseInt(row.querySelector("input").value, 10) || 0;

            const combatant = combatantsList.find(c => c.id === id);
            if (combatant) {
                combatant.dex = dexValue;
            }
        });

        combatantsList.sort((a, b) => {
            if (b.value === a.value) {
                return (b.dex || 0) - (a.dex || 0);
            }
            return b.value - a.value;
        });

        handleNaturals(combatantsList);
    }

    let buttonArea = document.getElementById("instruction-buttons");
    if (!buttonArea) {
        buttonArea = document.createElement("div");
        buttonArea.id = "instruction-buttons";
        buttonArea.className = "flex justify-center w-2/3 space-x-4";
        instructions.parentNode.insertBefore(buttonArea, instructions.nextSibling);
    }

    buttonArea.innerHTML = "";

    const dexArea = document.createElement("div");
    dexArea.id = "dex-area";
    dexArea.className = "w-full space-y-2";

    groups.forEach(group => {
        group.forEach(combatant => {
            const row = document.createElement("div");
            row.className = "flex justify-between";
            row.dataset.id = combatant.id;

            const p = document.createElement("p");
            p.className = "font-tiamat text-xl";
            p.textContent = combatant.name;

            const dexInput = document.createElement("input");
            dexInput.type = "number";
            dexInput.min = 1;
            dexInput.value = combatant.dex ?? 8;
            dexInput.className = "w-12 p-1 text-center text-black bg-gray-100";

            row.append(p, dexInput);
            dexArea.appendChild(row);
        });
    });

    buttonArea.appendChild(dexArea);
}

function handleNaturals(fullList) {
    const twenties = fullList.filter(c => c.value === 20);

    let buttonArea = document.getElementById("instruction-buttons");
    if (!buttonArea) {
        buttonArea = document.createElement("div");
        buttonArea.id = "instruction-buttons";
        buttonArea.className = "flex justify-center w-2/3 space-x-4";
        instructions.parentNode.insertBefore(buttonArea, instructions.nextSibling);
    }

    buttonArea.innerHTML = "";

    processNaturalQueue([...twenties], fullList, buttonArea);
}

function processNaturalQueue(queue, fullList, buttonArea, takenPositions = []) {
    if (queue.length === 0) {
        showInitiativeOrder(fullList);
        return;
    }

    const combatant = queue.shift();

    askNatural(combatant, fullList, buttonArea, () => {
        processNaturalQueue(queue, fullList, buttonArea, takenPositions);
    }, takenPositions);
}

function askNatural(combatant, fullList, buttonArea, done, takenPositions) {
    instructions.textContent = `Was ${combatant.name}'s 20 natural?`;
    combatants.classList.add("hidden");

    buttonArea.innerHTML = "";

    const yesBtn = document.createElement("button");
    yesBtn.textContent = "Yes";
    yesBtn.className = "px-4 py-2 font-tiamat text-xl text-white bg-green-600 active:brightness-90 cursor-pointer";

    const noBtn = document.createElement("button");
    noBtn.textContent = "No";
    noBtn.className = "px-4 py-2 font-tiamat text-xl text-white bg-red active:brightness-90 cursor-pointer";

    buttonArea.appendChild(yesBtn);
    buttonArea.appendChild(noBtn);

    yesBtn.onclick = () => {
        buttonArea.innerHTML = "";
        askPosition(combatant, fullList, buttonArea, pos => {
            takenPositions.push(pos);
            done();
        }, takenPositions);
    };

    noBtn.onclick = () => {
        buttonArea.innerHTML = "";
        done();
    };

    nextBtn.classList.add("hidden");
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function askPosition(combatant, fullList, buttonArea, done, takenPositions = []) {
    instructions.textContent = `When would ${combatant.name} like to go?`;
    combatants.classList.add("hidden");

    const select = document.createElement("select");
    select.className = "mx-auto px-4 py-2 text-center text-black bg-gray-100";

    for (let i = 0; i < fullList.length; i++) {
        if (takenPositions.includes(i)) continue;

        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = getOrdinal(i + 1);
        select.appendChild(opt);
    }

    buttonArea.appendChild(select);

    nextBtn.classList.remove("hidden");
    nextBtn.textContent = "Confirm";

    setTimeout(() => {
        nextBtn.addEventListener("click", confirmPosition);
    }, 500);

    const confirmPosition = () => {
        nextBtn.removeEventListener("click", confirmPosition);

        const pos = parseInt(select.value, 10);
        const idx = fullList.findIndex(c => c.id === combatant.id);
        if (idx !== -1) fullList.splice(idx, 1);

        fullList.splice(pos, 0, combatant);
        buttonArea.innerHTML = "";
        nextBtn.classList.add("hidden");
        done(pos);
    }
}

function showInitiativeOrder(list) {
    instructions.classList.add("hidden");
    combatants.classList.add("hidden");
    combatantModifiers.classList.add("hidden");
    nextBtn.classList.add("hidden");
    carousel.classList.remove("hidden");

    combatantsList = list;
    totalSlides = list.length;

    slideTrack.innerHTML = "";

    list.forEach((combatant, index) => {
        const slide = document.createElement("div");
        slide.className = "slide flex flex-shrink-0 justify-center items-center w-full";
        slide.dataset.index = index;

        const div = document.createElement("div");
        div.className = "flex justify-center items-center h-full w-full duration-500 ease-in-out";
        div.innerHTML = `
            <div class="w-2/3 mx-auto space-y-2">
                <h2 class="font-tiamat text-3xl text-center">${combatant.name}</h2>
                <div class="flex items-center justify-around">
                    <div class="flex space-x-2">
                        <svg role="graphics-symbol" aria-hidden="true" focusable="false"
                            id="hp-symbol" class="size-6 fill-white" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                        </svg>
                        <input type="number" name="hp" class="w-12 font-roboto text-xl font-bold" placeholder="HP">
                    </div>
                    <select name="condition" class="py-1 w-2/3 font-roboto text-xl font-bold">
                        <option value="" disabled selected hidden>CONDITION</option>
                        <option value="normal">Normal</option>
                        <option value="blinded">Blinded</option>
                        <option value="charmed">Charmed</option>
                        <option value="deafened">Deafened</option>
                        <option value="frightened">Frightened</option>
                        <option value="grappled">Grappled</option>
                        <option value="incapacitated">Incapacitated</option>
                        <option value="invisible">Invisible</option>
                        <option value="paralysed">Paralysed</option>
                        <option value="petrified">Petrified</option>
                        <option value="poisoned">Poisoned</option>
                        <option value="prone">Prone</option>
                        <option value="restrained">Restrained</option>
                        <option value="stunned">Stunned</option>
                        <option value="unconscious">Unconscious</option>
                    </select>
                </div>
                <div class="flex items-center justify-around">
                    <div class="flex space-x-2">
                        <svg role="graphics-symbol" aria-hidden="true" focusable="false"
                            id="ac-symbol" class="size-6 fill-white" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"/>
                        </svg>
                        <input type="number" name="ac" class="w-12 font-roboto text-xl font-bold" placeholder="AC">
                    </div>
                    <button class="dead-btn py-1 w-2/3 font-roboto text-xl font-bold uppercase bg-red cursor-pointer">Dead</button>
                </div>
            </div>
        `;

        div.querySelector(".dead-btn").addEventListener("mousedown", () => {
            const condemned = slide.querySelector("h2");
            condemned.classList.add("text-red", "line-through")
        });

        div.querySelector(".dead-btn").addEventListener("click", () => {
            if(isSliding) return;
            isSliding = true;

            slideTrack.style.transition = "transform 0.5s ease-in-out";
            slideTrack.style.transform = "translateX(-100%)";

            slide.dataset.dead = "true";

            if (slideTrack.children.length === 2) {
                const lastSlide = [...slideTrack.children].find(child => child !== slide);
                const lastOneStanding = lastSlide.querySelector("h2").textContent;
        
                winner.classList.remove("hidden");
                winner.textContent = `${lastOneStanding} Wins!`;
        
                carousel.classList.add("hidden");
        
                nextBtn.textContent = "Reset";
                nextBtn.classList.remove("hidden");
                nextBtn.addEventListener("click", reset);
            }

            setTimeout(() => {
                slideTrack.style.transition = "none";

                const firstSlide = slideTrack.firstElementChild;
                slideTrack.appendChild(firstSlide);
                slideTrack.style.transform = "translateX(0%)";

                if (firstSlide.dataset.dead === "true") {
                    slideTrack.removeChild(firstSlide);
                    totalSlides--;
                }
                
                isSliding = false;
            }, 500);
        });
    
        slide.appendChild(div);
        slideTrack.appendChild(slide);
    }); 
}

nextCombatant.addEventListener("click", () => {
    if (isSliding) return;
    isSliding = true;

    slideTrack.style.transition = "transform 0.5s ease-in-out";
    slideTrack.style.transform = "translateX(-100%)";

    setTimeout(() => {
        slideTrack.style.transition = "none";

        const firstSlide = slideTrack.firstElementChild;
        slideTrack.appendChild(firstSlide);
        slideTrack.style.transform = "translateX(0%)";

        if (firstSlide.dataset.dead === "true") {
            slideTrack.removeChild(firstSlide);
            totalSlides--;
        }

        isSliding = false;
    }, 500);
});

resetInitiative.addEventListener("click", reset)

function reset() {
    nextBtn.removeEventListener("click", reset);
    setTimeout(() => {
        nextBtn.addEventListener("click", createCombatants);
    }, 500);

    combatantsList = [];
    combatantCount = 2;
    totalSlides = 0;

    winner.classList.add("hidden");
    winner.textContent = "";

    carousel.classList.add("hidden");
    slideTrack.innerHTML = "";

    combatants.classList.remove("hidden");
    combatants.innerHTML = "";

    for (let i = 1; i <= 2; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = `combatant${i}`;
        input.name = `combatant${i}`;
        input.placeholder = `Combatant #${i}`;
        input.className = "p-1 text-center text-black bg-gray-100";
        combatants.appendChild(input);
    }

    combatantModifiers.classList.remove("hidden");

    minusBtn.classList.remove(...activeClasses);
    minusBtn.classList.add(...inactiveClasses);
    minusSymbol.classList.remove("fill-white");
    minusSymbol.classList.add("fill-gray-600");

    instructions.textContent = "Please add combatants";
    instructions.classList.remove("hidden");

    nextBtn.textContent = "Next";
    nextBtn.classList.remove("hidden");
}
