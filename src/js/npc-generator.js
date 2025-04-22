window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('generatedName');
    const title = document.getElementById('title');

    if (name) {
        title.innerText = `Set ${name}'s Level & Modifiers`;
    } else {
        title.innerText = 'Set NPC Level & Modifiers';
    }
});