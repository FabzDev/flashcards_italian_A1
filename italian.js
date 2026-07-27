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
const sentenceArea = document.getElementById('sentence-area');
const sentenceEdit = document.getElementById('sentence-edit');
const sentenceInput = document.getElementById('sentence-input');
const saveSentenceBtn = document.getElementById('save-sentence');
const sentenceView = document.getElementById('sentence-view');
const sentenceText = document.getElementById('sentence-text');
const editSentenceBtn = document.getElementById('edit-sentence');

let currentIndex = 0;

// Helpers to store items in localStorage with an expiry (ms)
function setWithExpiry(key, value, ttl) {
    const item = {
        value: value,
        expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    try {
        const item = JSON.parse(itemStr);
        if (!item || !item.expiry) return itemStr;
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch (e) {
        // if parse fails, return raw string
        return itemStr;
    }
}

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
    if (sentenceArea) sentenceArea.style.display = 'none';
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

// Toggle translation when clicking the word only (avoid accidental clicks on whole card)
if (q) {
    q.addEventListener('click', (e) => {
        if (!a) return;
        const willShow = (a.style.display === 'none' || a.style.display === '');
        a.style.display = willShow ? 'block' : 'none';
        if (sentenceArea) {
            sentenceArea.style.display = willShow ? 'block' : 'none';
            if (willShow) loadSentenceUI();
        }
        e.stopPropagation();
    });
}

function sentenceKey() {
    if (!cards.length) return null;
    // use source and target pair as stable key
    const src = String(cards[currentIndex][0]);
    const tgt = String(cards[currentIndex][1]);
    return `sentence|${src}||${tgt}`;
}

function loadSentenceUI() {
    const key = sentenceKey();
    if (!key) return;
    const saved = getWithExpiry(key);
    if (!sentenceArea) return;
    if (saved && saved.trim() !== '') {
        // show saved view
        if (sentenceView) sentenceView.style.display = 'block';
        if (sentenceEdit) sentenceEdit.style.display = 'none';
        if (sentenceText) {
            sentenceText.value = saved;
        }
    } else {
        // show editor
        if (sentenceView) sentenceView.style.display = 'none';
        if (sentenceEdit) sentenceEdit.style.display = 'block';
        if (sentenceInput) sentenceInput.value = '';
    }
}

function saveSentence() {
    const key = sentenceKey();
    if (!key || !sentenceInput) return;
    const text = sentenceInput.value.trim();
    if (text === '') return;
    // store for 30 days
    setWithExpiry(key, text, 30 * 24 * 60 * 60 * 1000);
    loadSentenceUI();
}

function editSentence() {
    const key = sentenceKey();
    if (!key) return;
    const saved = getWithExpiry(key) || '';
    if (sentenceEdit) sentenceEdit.style.display = 'block';
    if (sentenceView) sentenceView.style.display = 'none';
    if (sentenceInput) sentenceInput.value = saved;
}


if (saveSentenceBtn) saveSentenceBtn.addEventListener('click', saveSentence);
if (editSentenceBtn) editSentenceBtn.addEventListener('click', editSentence);

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
    // Do not intercept keys when user is typing in inputs, textareas or contenteditable elements
    const t = event.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { goNext(); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { goPrev(); }
    else if (event.key === ' ' || event.key === 'Spacebar') { event.preventDefault(); if (!a) return; a.style.display = (a.style.display === 'none' || a.style.display === '') ? 'block' : 'none'; }
});

loadCards();
