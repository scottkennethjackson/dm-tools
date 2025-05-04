const diceBtn = document.getElementById("dice-btn");
const closeBtn = document.getElementById("close-btn");
const diceTray = document.getElementById("dice-tray");

diceBtn.addEventListener("click", function () {
    closeBtn.classList.remove("hidden");
    diceTray.classList.remove("-top-full")
    diceTray.classList.add("top-2")
});

closeBtn.addEventListener("click", function () {
    closeBtn.classList.add("hidden");
    diceTray.classList.remove("top-2")
    diceTray.classList.add("-top-full")
}) 
