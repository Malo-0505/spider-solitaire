
const tableau = document.getElementById('tableau');
const startButton = document.getElementById('startButton');
const dealButton = document.getElementById('dealButton');

let columns = [];
let selectedStack = null;
let deck = [];

startButton.addEventListener('click', initGame);
dealButton.addEventListener('click', dealCards);

function createDeck() {
    const suits = ['♠'];
    const ranks = [13,12,11,10,9,8,7,6,5,4,3,2,1];
    let newDeck = [];
    for (let i = 0; i < 8; i++) {
        for (let rank of ranks) {
            newDeck.push({ suit: suits[0], rank });
        }
    }
    return shuffle(newDeck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initGame() {
    tableau.innerHTML = '';
    columns = [];
    selectedStack = null;
    deck = createDeck();

    for (let i = 0; i < 10; i++) {
        const column = document.createElement('div');
        column.className = 'column';
        columns.push([]);
        tableau.appendChild(column);
    }

    for (let i = 0; i < 54; i++) {
        const card = deck.pop();
        columns[i % 10].push(card);
    }

    render();
}

function dealCards() {
    if (deck.length < 10) return;
    for (let i = 0; i < 10; i++) {
        columns[i].push(deck.pop());
    }
    render();
}

function render() {
    tableau.querySelectorAll('.column').forEach((colElem, colIndex) => {
        colElem.innerHTML = '';
        columns[colIndex].forEach((card, index) => {
            const cardElem = document.createElement('div');
            cardElem.className = 'card';
            cardElem.textContent = card.rank + card.suit;
            cardElem.style.top = (index * 20) + 'px';
            cardElem.dataset.col = colIndex;
            cardElem.dataset.index = index;

            if (selectedStack &&
                selectedStack.col == colIndex &&
                index >= selectedStack.index) {
                cardElem.classList.add('selected');
            }

            cardElem.addEventListener('click', onCardClick);
            colElem.appendChild(cardElem);
        });
    });
}

function onCardClick(e) {
    const col = parseInt(e.currentTarget.dataset.col);
    const index = parseInt(e.currentTarget.dataset.index);

    if (!selectedStack) {
        if (!isDescendingStack(col, index)) return;
        selectedStack = { col, index };
    } else {
        if (moveCards(selectedStack.col, selectedStack.index, col)) {
            selectedStack = null;
        } else {
            selectedStack = null;
        }
    }
    render();
}

function isDescendingStack(col, startIndex) {
    let stack = columns[col].slice(startIndex);
    for (let i = 0; i < stack.length - 1; i++) {
        if (stack[i].rank !== stack[i + 1].rank + 1) return false;
    }
    return true;
}

function moveCards(fromCol, fromIndex, toCol) {
    if (columns[fromCol].length === 0) return false;
    if (columns[toCol].length === 0) {
        const moving = columns[fromCol].splice(fromIndex);
        columns[toCol] = columns[toCol].concat(moving);
        return true;
    }

    const fromCard = columns[fromCol][fromIndex];
    const toCard = columns[toCol][columns[toCol].length - 1];

    if (toCard.rank === fromCard.rank + 1) {
        const moving = columns[fromCol].splice(fromIndex);
        columns[toCol] = columns[toCol].concat(moving);
        return true;
    }
    return false;
}
