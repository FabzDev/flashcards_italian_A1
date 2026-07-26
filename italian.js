let cards = [];

async function loadCards() {
    try {
        const response = await fetch('cards.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        cards = await response.json();
        currentIndex = cards.length > 0 ? getRandomIndex(cards.length) : 0;
        render();
    } catch (error) {
        console.error('No se pudieron cargar las tarjetas:', error);
        cards = [];
        currentIndex = 0;
        if (q) q.textContent = 'No se pudieron cargar las tarjetas';
        if (a) a.textContent = 'Comprueba el archivo cards.json';
    }
}

const progress = document.getElementById('progress');
const q = document.getElementById('q');
const a = document.getElementById('a');
const cardElement = document.querySelector('.card');
const easyButton = document.getElementById('easy');
const medButton = document.getElementById('med');
const hardButton = document.getElementById('hard');

let currentIndex = 0;

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function formatWord(value) {
    return String(value).toUpperCase();
}

function render() {
    if (!cards.length) {
        if (progress) progress.textContent = '0/0';
        return;
    }

    if (progress) progress.textContent = `${currentIndex + 1}/${cards.length}`;
    if (q) q.textContent = formatWord(cards[currentIndex][0]);
    if (a) a.textContent = formatWord(cards[currentIndex][1]);
    if (a) a.style.display = 'none';
}

function goNext() {
    if (!cards.length) return;
    currentIndex = getRandomIndex(cards.length);
    render();
}

function goPrev() {
    if (!cards.length) return;
    currentIndex = getRandomIndex(cards.length);
    render();
}

// Toggle translation when clicking the card
if (cardElement) {
    cardElement.addEventListener('click', () => {
        if (!a) return;
        a.style.display = (a.style.display === 'none' || a.style.display === '') ? 'block' : 'none';
    });
}

if (easyButton) easyButton.addEventListener('click', () => { goNext(); });

if (medButton) medButton.addEventListener('click', () => {
    // Re-insert current card a bit later
    cards.splice(Math.min(currentIndex + 5, cards.length), 0, cards[currentIndex]);
    goNext();
});

if (hardButton) hardButton.addEventListener('click', () => {
    // Re-insert current card soon
    cards.splice(Math.min(currentIndex + 2, cards.length), 0, cards[currentIndex]);
    goNext();
});

window.addEventListener('keydown', (event) => {
    if (event.target && event.target.matches && event.target.matches('button')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { goNext(); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { goPrev(); }
    else if (event.key === ' ' || event.key === 'Spacebar') { event.preventDefault(); if (!a) return; a.style.display = (a.style.display === 'none' || a.style.display === '') ? 'block' : 'none'; }
});

loadCards();
