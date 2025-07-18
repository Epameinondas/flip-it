class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        this.gameStarted = false;
        this.canFlip = true;
        
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.attemptsElement = document.getElementById('attempts');
        this.startBtn = document.getElementById('startBtn');
        this.gameOverElement = document.getElementById('gameOver');
        
        this.startBtn.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.resetGame();
        this.generateCards();
        this.renderCards();
        this.gameStarted = true;
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'Game In Progress';
        this.gameOverElement.style.display = 'none';
    }

    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        this.canFlip = true;
        this.updateDisplay();
        this.gameBoard.innerHTML = '';
    }

    generateCards() {
        const numbers = [1, 2, 3, 4, 5, 6];
        const cardPairs = [...numbers, ...numbers];
        
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }
        
        this.cards = cardPairs.map((number, index) => ({
            id: index,
            number: number,
            isFlipped: false,
            isMatched: false
        }));
    }

    renderCards() {
        this.gameBoard.innerHTML = '';
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.id = card.id;
            cardElement.addEventListener('click', () => this.flipCard(card.id));
            this.gameBoard.appendChild(cardElement);
        });
    }

    flipCard(cardId) {
        if (!this.gameStarted || !this.canFlip || this.flippedCards.length >= 2) return;
        
        const card = this.cards[cardId];
        if (card.isFlipped || card.isMatched) return;
        
        card.isFlipped = true;
        this.flippedCards.push(card);
        this.updateCardDisplay(cardId);
        
        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            this.attempts++;
            this.updateDisplay();
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.number === card2.number) {
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            this.score++;
            this.updateCardDisplay(card1.id);
            this.updateCardDisplay(card2.id);
            
            if (this.matchedPairs === 4) {
                this.endGame();
            }
        } else {
            card1.isFlipped = false;
            card2.isFlipped = false;
            this.updateCardDisplay(card1.id);
            this.updateCardDisplay(card2.id);
        }
        
        this.flippedCards = [];
        this.canFlip = true;
        this.updateDisplay();
    }

    updateCardDisplay(cardId) {
        const cardElement = document.querySelector(`[data-id="${cardId}"]`);
        const card = this.cards[cardId];
        
        if (card.isMatched) {
            cardElement.className = 'card matched';
            cardElement.textContent = card.number;
        } else if (card.isFlipped) {
            cardElement.className = 'card flipped';
            cardElement.textContent = card.number;
        } else {
            cardElement.className = 'card';
            cardElement.textContent = '';
        }
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.attemptsElement.textContent = this.attempts;
    }

    endGame() {
        this.gameStarted = false;
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'Start New Game';
        this.gameOverElement.style.display = 'block';
    }
}

const game = new MemoryGame();
