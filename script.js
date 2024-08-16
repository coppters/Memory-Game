const flipCounter = document.getElementById('flipCounter');
const playAgainBtn = document.getElementById('playAgainBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const playGameBtn = document.getElementById('playGameBtn');
const overlay = document.getElementById('overlay');
const memoryGame = document.querySelector('.memory-game');
const pairCount = document.getElementById('pairCount');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let flips = 0;

const images = [];
for (let i = 1; i <= 132; i++) {
    images.push(`images/image${i}.gif`);
}

function createCards(totalPairs) {
    const cardArray = [];
    const selectedImages = shuffle(images).slice(0, totalPairs); // Randomly select images based on pair count

    for (let i = 0; i < totalPairs; i++) {
        const card1 = createCardElement(i, selectedImages[i]);
        const card2 = createCardElement(i, selectedImages[i]);
        cardArray.push(card1, card2);
    }

    shuffle(cardArray).forEach(card => memoryGame.appendChild(card));

    adjustGrid(totalPairs); // Adjust the grid layout based on the number of pairs
}

function createCardElement(index, image) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.framework = `image${index}`;

    card.innerHTML = `
        <img class="front-face" src="${image}" alt="image${index}">
        <img class="back-face" src="images/UNKNOWN.png" alt="Memory Card">
    `;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    incrementFlipCounter();

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function incrementFlipCounter() {
    flips++;
    flipCounter.textContent = flips;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function adjustGrid(totalPairs) {
    const columns = Math.ceil(Math.sqrt(totalPairs * 2)); // Calculate the number of columns based on pairs
    memoryGame.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; // Adjust grid columns
}

function resetGame() {
    flips = 0;
    flipCounter.textContent = flips;
    memoryGame.innerHTML = ''; // Clear existing cards

    const selectedPairCount = parseInt(pairCount.value, 10); // Get the selected number of pairs
    createCards(selectedPairCount); // Create new set of cards based on selected pairs
}

playAgainBtn.addEventListener('click', resetGame);

playGameBtn.addEventListener('click', () => {
    backgroundMusic.play(); // Start background music
    overlay.style.display = 'none'; // Hide overlay
    resetGame(); // Initialize the game
});

(function initializeGame() {
    overlay.style.display = 'flex'; // Ensure overlay is shown at the start
})();
