const cards = [
    ["ser, estar", "essere"],
    ["tener", "avere"],
    ["hacer", "fare"],
    ["ir", "andare"],
    ["venir", "venire"],
    ["estar, quedarse", "stare"],
    ["decir", "dire"],
    ["dar", "dare"],
    ["tomar", "prendere"],
    ["poner", "mettere"],
    ["encontrar", "trovare"],
    ["buscar", "cercare"],
    ["ver", "vedere"],
    ["mirar", "guardare"],
    ["oír, sentir", "sentire"],
    ["escuchar", "ascoltare"],
    ["hablar", "parlare"],
    ["preguntar, pedir", "chiedere"],
    ["responder", "rispondere"],
    ["saber", "sapere"],
    ["conocer", "conoscere"],
    ["pensar", "pensare"],
    ["entender", "capire"],
    ["creer", "credere"],
    ["querer", "volere"],
    ["poder", "potere"],
    ["deber", "dovere"],
    ["llegar", "arrivare"],
    ["partir, salir", "partire"],
    ["entrar", "entrare"],
    ["salir", "uscire"],
    ["vivir", "vivere"],
    ["habitar, vivir", "abitare"],
    ["trabajar", "lavorare"],
    ["estudiar", "studiare"],
    ["aprender", "imparare"],
    ["enseñar", "insegnare"],
    ["comer", "mangiare"],
    ["beber", "bere"],
    ["cocinar", "cucinare"],
    ["comprar", "comprare"],
    ["vender", "vendere"],
    ["pagar", "pagare"],
    ["abrir", "aprire"],
    ["cerrar", "chiudere"],
    ["empezar", "iniziare"],
    ["terminar", "finire"],
    ["dormir", "dormire"],
    ["despertarse", "svegliarsi"],
    ["esperar", "aspettare"],
    ["y", "e"],
    ["también", "anche"],
    ["o", "oppure"],
    ["o", "o"],
    ["pero", "ma"],
    ["sin embargo", "però"],
    ["en cambio", "invece"],
    ["porque, por qué", "perché"],
    ["entonces", "quindi"],
    ["por eso", "perciò"],
    ["así", "così"],
    ["entonces", "allora"],
    ["si", "se"],
    ["cuando", "quando"],
    ["mientras", "mentre"],
    ["antes", "prima"],
    ["después", "dopo"],
    ["hoy", "oggi"],
    ["ayer", "ieri"],
    ["mañana", "domani"],
    ["ahora", "adesso"],
    ["siempre", "sempre"],
    ["nunca", "mai"],
    ["ya", "già"],
    ["todavía", "ancora"],
    ["a menudo", "spesso"],
    ["a veces", "qualche volta"],
    ["mucho, muy", "molto"],
    ["poco", "poco"],
    ["demasiado", "troppo"],
    ["bastante", "abbastanza"],
    ["más", "più"],
    ["menos", "meno"],
    ["aquí", "qui"],
    ["allí", "lì"],
    ["cerca", "vicino"],
    ["lejos", "lontano"],
    ["dentro", "dentro"],
    ["fuera", "fuori"],
    ["no", "non"],
    ["sí", "sì"],
    ["quizás", "forse"],
    ["claro", "certo"],
    ["a", "a"],
    ["de", "di"],
    ["desde, por", "da"],
    ["con", "con"],
    ["para, por", "per"],
    ["en", "in"],
    ["sobre, en", "su"]
];

const progress = document.getElementById('progress');
const q = document.getElementById('q');
const a = document.getElementById('a');
const showButton = document.getElementById('show');
const speakButton = document.getElementById('speak');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const shuffleButton = document.getElementById('shuffle');
const easyButton = document.getElementById('easy');
const medButton = document.getElementById('med');
const hardButton = document.getElementById('hard');

let currentIndex = 0;
const supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

function render() {
    progress.textContent = `${currentIndex + 1}/${cards.length}`;
    q.textContent = cards[currentIndex][0];
    a.textContent = cards[currentIndex][1];
    a.style.display = 'none';
}

function goNext() {
    currentIndex = (currentIndex + 1) % cards.length;
    render();
}

function goPrev() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    render();
}

function speakCurrent() {
    if (!supportsSpeech) {
        return;
    }

    const utterance = new SpeechSynthesisUtterance(cards[currentIndex][1]);
    utterance.lang = 'it-IT';
    speechSynthesis.speak(utterance);
}

showButton.addEventListener('click', () => {
    a.style.display = 'block';
});

speakButton.addEventListener('click', speakCurrent);

nextButton.addEventListener('click', goNext);
prevButton.addEventListener('click', goPrev);

shuffleButton.addEventListener('click', () => {
    for (let j = cards.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [cards[j], cards[k]] = [cards[k], cards[j]];
    }
    currentIndex = 0;
    render();
});

easyButton.addEventListener('click', goNext);

medButton.addEventListener('click', () => {
    cards.splice(Math.min(currentIndex + 5, cards.length), 0, cards[currentIndex]);
    goNext();
});

hardButton.addEventListener('click', () => {
    cards.splice(Math.min(currentIndex + 2, cards.length), 0, cards[currentIndex]);
    goNext();
});

window.addEventListener('keydown', (event) => {
    if (event.target.matches('button')) {
        return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        goNext();
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        goPrev();
    }
});

if (!supportsSpeech) {
    speakButton.disabled = true;
    speakButton.title = 'Speech synthesis is not available in this browser.';
}

render();

