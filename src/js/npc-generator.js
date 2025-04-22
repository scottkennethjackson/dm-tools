window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('generatedName');
    const title = document.getElementById('title');

    if (name) {
        title.innerText = `Select ${name}'s Level`;
    } else {
        title.innerText = 'Set NPC Level & Modifiers';
    }
});