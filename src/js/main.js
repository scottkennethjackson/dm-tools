const title = document.getElementById('title');
const description = document.getElementById('description');
const toolSelector = document.getElementById('tool-selector');
const goBtn = document.getElementById('go-btn');

let tools = [];
let toolTitle;
let toolDescription;
let toolLink;

fetch('src/json/tools.json')
    .then(response => response.json())
    .then(data => {
        tools = data.tools;
    });

function handleClick() {
    location.href = toolLink;
};

function handleSelection() {
    selection = toolSelector.value;
    inactiveClasses = ['text-gray-600', 'bg-gray-400', 'cursor-not-allowed'];
    activeClasses = ['text-white', 'bg-red', 'active:brightness-90', 'cursor-pointer'];

    for (const toolArray of tools) {
        if (toolArray[selection]) {
            const tool = toolArray[selection][0];
            toolTitle = tool.title;
            toolDescription = tool.description;
            toolLink = tool.link;
        }
    }

    if (selection !== 'empty') {
        goBtn.classList.remove(...inactiveClasses);
        goBtn.classList.add(...activeClasses);
        title.innerHTML = toolTitle;
        description.innerHTML = toolDescription;
        description.classList.remove('hidden');
        goBtn.addEventListener('click', handleClick)
    } else {
        goBtn.classList.remove(...activeClasses);
        goBtn.classList.add(...inactiveClasses);
        title.innerHTML = 'Make Your Choice';
        description.innerHTML = '';
        description.classList.add('hidden');
        goBtn.removeEventListener('click', handleClick);
    };
};

toolSelector.addEventListener('change', handleSelection);
