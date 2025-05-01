const hintBtn = document.getElementById('hint');

function showHint() {
    hintBtn.classList.add('hidden');
}

hintBtn.addEventListener("click", showHint);
