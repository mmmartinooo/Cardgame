class Deck {
    static SUIT_CLUB = "♣";
    static SUIT_DIAMOND = "♦";
    static SUIT_HEART = "♥";
    static SUIT_SPADE = "♠";

    static VALUE_A = "A";
    static VALUE_2 = "2";
    static VALUE_3 = "3";
    static VALUE_4 = "4";
    static VALUE_5 = "5";
    static VALUE_6 = "6";
    static VALUE_7 = "7";
    static VALUE_8 = "8";
    static VALUE_9 = "9";
    static VALUE_KNIGHT = "J";
    static VALUE_QUEEN = "Q";
    static VALUE_KING = "K";

    static COLOR_RED = "red";
    static COLOR_BLACK = "black";

    static getSuits() {
        return [
            Deck.SUIT_CLUB,
            Deck.SUIT_DIAMOND,
            Deck.SUIT_HEART,
            Deck.SUIT_SPADE,
        ];
    }

    static getValues() {
        return [
            Deck.VALUE_A,
            Deck.VALUE_2,
            Deck.VALUE_3,
            Deck.VALUE_4,
            Deck.VALUE_5,
            Deck.VALUE_6,
            Deck.VALUE_7,
            Deck.VALUE_8,
            Deck.VALUE_9,
            Deck.VALUE_KNIGHT,
            Deck.VALUE_QUEEN,
            Deck.VALUE_KING,
        ];
    }

    static getSuitColor(suit) {
        switch (suit) {
            case Deck.SUIT_HEART:
            case Deck.SUIT_DIAMOND:
                return Deck.COLOR_RED;
            case Deck.SUIT_CLUB:
            case Deck.SUIT_SPADE:
                return Deck.COLOR_BLACK;
        }
    }

    static getRandomCard() {
        const cardIndex = Math.floor(Math.random() * Deck.getValues().length);
        const suitIndex = Math.floor(Math.random() * Deck.getSuits().length);

        const value = Deck.getValues()[cardIndex];
        const suit = Deck.getSuits()[suitIndex];
        const color = Deck.getSuitColor(suit);

        return new Card(value, suit, color)
    }
}

class Card {
    value
    suit
    color

    constructor(value, suit, color) {
        this.value = value
        this.suit = suit
        this.color = color
    }

    getDeckIndex() {
        return Deck.getValues().indexOf(this.value)
    }
}

class Game {
    card
    lastCard

    BET_LOWER = "lower"
    BET_EQUAL = "equal"
    BET_HIGHER = "higher"

    ATTEMPTS_LEFT
    POINTS

    EL_ATTEMPTS_LEFT
    EL_POINTS
    EL_BET_LOWER
    EL_BET_EQUAL
    EL_BET_HIGHER

    constructor() {
        this.bindElements()
        this.bindListeners()
        this.resetGame()
    }

    bindElements() {
        this.EL_ATTEMPTS_LEFT = document.querySelector('[data-game-attempts-left]');
        this.EL_POINTS = document.querySelector('[data-game-points]');
        this.EL_BET_LOWER = document.querySelector('[data-game-next-lower]');
        this.EL_BET_EQUAL = document.querySelector('[data-game-next-equal]');
        this.EL_BET_HIGHER = document.querySelector('[data-game-next-higher]');
    }

    bindListeners() {
        this.EL_BET_LOWER.addEventListener("click", () => this.doBet(this.BET_LOWER));
        this.EL_BET_EQUAL.addEventListener("click", () => this.doBet(this.BET_EQUAL));
        this.EL_BET_HIGHER.addEventListener("click", () => this.doBet(this.BET_HIGHER));
    }

    resetGame() {
        this.ATTEMPTS_LEFT = 3;
        this.POINTS = 0;
        this.card = undefined
        this.lastCard = undefined
        this.runGame()
    }

    updateUI() {
        return new Promise((resolve) => {
            this.EL_POINTS.innerHTML = this.POINTS
            this.EL_ATTEMPTS_LEFT.innerHTML = this.ATTEMPTS_LEFT
            document.getElementById("top").innerHTML = this.card.value + "<br/>" + this.card.suit;
            document.getElementById("symbols").innerHTML = this.card.suit;
            document.getElementById("bottom").innerHTML = this.card.value + "<br/>" + this.card.suit;
            document.getElementById("spelkort").style.color = this.card.color;

            /** Wait for html composition */
            setTimeout(() => {
                resolve()
            }, 300)
        })
    }

    runGame() {
        if (this.ATTEMPTS_LEFT == 0 || this.POINTS >= 52) return false;

        this.lastCard = this.card;
        this.setCard(Deck.getRandomCard());

        return true
    }

    incrementPoints() {
        const points = this.POINTS | 0;
        this.setPoints(points + this.card.getDeckIndex() + 1)
    }

    decrementAttempts() {
        this.setAttempts(this.ATTEMPTS_LEFT - 1)
    }

    setCard(card) {
        this.card = card;
        this.updateUI()
    }

    async setPoints(points) {
        this.POINTS = points
        await this.updateUI()
        if (this.POINTS >= 52) {
            const reset = confirm(`You rock. ${this.POINTS} points. Play again?`)
            if (reset) this.resetGame()
        }
    }

    async setAttempts(attempts) {
        this.ATTEMPTS_LEFT = attempts;
        await this.updateUI()
        if (this.ATTEMPTS_LEFT == 0) {
            const reset = confirm(`You suck. ${this.POINTS} points. Play again?`)
            if (reset) this.resetGame()
        }
    }

    doBet(bet) {
        if (!this.runGame()) return
        const wasBetRight = this.wasBetRight(bet)

        if (wasBetRight) {
            this.incrementPoints()
        } else {
            this.decrementAttempts()
        }
    }

    wasBetRight(bet) {
        const lastIndex = this.lastCard.getDeckIndex();
        const newIndex = this.card.getDeckIndex();

        if (bet == this.BET_LOWER) {
            if (lastIndex > newIndex) {
                return true;
            }
        }

        if (bet == this.BET_EQUAL) {
            if (lastIndex == newIndex) {
                return true;
            }
        }

        if (bet == this.BET_HIGHER) {
            if (lastIndex < newIndex) {
                return true;
            }
        }

        return false;
    }
}

new Game();