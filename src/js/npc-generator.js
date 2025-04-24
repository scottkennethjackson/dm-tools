window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('generatedName');
    const title = document.getElementById('title');

    if (name) {
        title.innerText = `Set ${name}'s Level`;
    } else {
        title.innerText = 'Set NPC Level';
    }
});

//So your setup would look like this:
//
//💾 Name is saved in localStorage on the first page (name-generator.html).
//🌐 npc-generator.html reads the name on page load, displays it in the <title>, and holds it in a variable (npcName).
//🎲 When the user selects a level and clicks rollBtn to generate the statblock:
//→ Use the stored npcName to assign it to the statblock.
//→ Then clear localStorage (so the next NPC won’t accidentally reuse the old name).
//
//💡 Here’s how you’d wire it up:
//let npcName = localStorage.getItem('generatedName') || "Unnamed";
//
//window.addEventListener('DOMContentLoaded', () => {
//    const title = document.getElementById('title');
//
//    if (npcName !== "Unnamed") {
//        title.innerText = `Select ${npcName}'s Level`;
//    } else {
//        title.innerText = "Select an NPC's Level";
//    }
//});
//
//const rollBtn = document.getElementById('roll-btn');
//
//rollBtn.addEventListener('click', () => {
//    // Example: Your statblock generation logic
//    console.log(`Generating statblock for: ${npcName}`);
//
//    // After generating, clear the name so the next one will be fresh
//    localStorage.removeItem('generatedName');
//
//    // You can proceed with any further statblock display logic here
//});
