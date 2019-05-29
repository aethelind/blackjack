// make win() and lose() functions to avoid repeating code, so it updates innerhtml and win/loss count html
// probably should not have it shuffled bc the game can be cheesed, but should instead have a function to replace pop() that grabs a random card and removes it.
// Deck of cards info:
//
var deck = [];
var suits = ["♠️", "♥︎", "♣︎", "♦︎"];
var colours = ["#444", "#E85A4F"];
var names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];


var playerHand = [];
var dealerHand = [];

var sum = 0;
var gameover = false;

// hands are soft unless they become hard
var soft = true;

var wins = 0;
var losses = 0;

function start() {
    var newButton = document.getElementById("new");
    newButton.addEventListener("click", hit, false);

    var standButton = document.getElementById("stand");
    standButton.addEventListener("click", stand, false);

    setDeck();
    hit();
}

function stand() {
    var dealerCardDiv = document.getElementById("dealerCard");
    dealerCardDiv.innerHTML = "";
    var dealerOutcomeDiv = document.getElementById("dealerOutcome");
    dealerOutcomeDiv.innerHTML = "";

    // store it in the hand
    dealerHand.push(deck.pop());
    dealerHand.push(deck.pop());

    dealerCardDiv.innerHTML += "<div style='color:" + dealerHand[0].colour + ";'>" + dealerHand[0].name + " " + dealerHand[0].suit + "</div><div>🃏</div>";



}


function clear() {
    var playerCardDiv = document.getElementById("playerCard");
    playerCardDiv.innerHTML = "";
    var playerOutcomeDiv = document.getElementById("playerOutcome");
    playerOutcomeDiv.innerHTML = "";

    var winDiv = document.getElementById("win");
    winDiv.innerHTML = "👍 " + wins;
    var loseDiv = document.getElementById("lose");
    loseDiv.innerHTML = "👎 " + losses;

    setDeck();
    flag = true;

    sum = 0;
    var sumDiv = document.getElementById("sum")
    sumDiv.innerHTML = "Total: " + sum;
    var addDiv = document.getElementById("addition")
    addDiv.innerHTML = "( )";
    playerHand = []
    soft = true;
}

function hit() {
    if (gameover) {
        clear();
        gameover = false;
    }

    // pop top card, which removes it from the deck.   
    var card = deck.pop();

    // store it in the hand
    playerHand.push(card);

    getOutcome(card);

    // display card on table
    var playerCardDiv = document.getElementById("playerCard");
    playerCardDiv.innerHTML += "<div style='color:" + card.colour + ";'>" + card.name + " " + card.suit + "</div>";

    // recalculate sum
    sum = handSum();
    var sumDiv = document.getElementById("sum")
    sumDiv.innerHTML = "Total: " + sum;

    // show hand summation
    var addDiv = document.getElementById("addition")
    addDiv.innerHTML = "(";
    for (var i = 0; i < playerHand.length; i++) {
        addDiv.innerHTML += playerHand[i].value;
        if (i != playerHand.length - 1) {
            addDiv.innerHTML += " + "
        }
    }
    addDiv.innerHTML += ")";

}
// goes through the hand, changes Aces one by one and changes their value from 11 to 1.
function fixHand() {
    var soft = false;
    var i = 0;

    while (i < playerHand.length && !soft) {
        if (playerHand[i].value == 11) {
            playerHand[i].value = 1;
            soft = true;
        }
        i++;
    }

    // returns true if somethings been changed.
    return soft;
}

// looks at a hand with a new card and checks whether it can be valid
function getOutcome(card) {
    var playerOutcomeDiv = document.getElementById("playerOutcome");

    // If its a blackjack, ...
    if (sum + card.value == 21) {
        playerOutcomeDiv.innerHTML += "<div style='color:#3B945E;'> BlackJack! </div>";
        wins++;
        gameover = true;
    } else if (sum + card.value > 21) {
        // If its more than 21, lets check it out.
        var fixed = false;
        // see if we can change an Ace. 
        while (fixHand() && !fixed) {
            //if we can, we re-check the sum to see if its acceptable
            var tmp = handSum();
            if (tmp <= 21) {
                sum = tmp;
                fixed = true;
            }
            // if it isnt, we check the remaining cards in the hand for other aces
        }
        if (fixed) {
            // the sum is equal to 21
            if (sum == 21) {
                playerOutcomeDiv.innerHTML += "<div style='color:#3B945E;'> BlackJack! </div>";
                wins++;
                gameover = true;
            } // otherwise, its lower and so we do nothing. the game continues.

        } else {
            // the sum is higher than 21
            playerOutcomeDiv.innerHTML += "<div style='color:#777;'> Bust! </div>";
            losses++;
            gameover = true;
        }
    }


}

function handSum() {
    var s = 0;
    for (var i = 0; i < playerHand.length; i++) {
        s += playerHand[i].value
    }
    return s;
}


function setDeck() {
    // sets up all cards in deck.
    for (var i = 0; i < 52; i++) {
        deck[i] = {
            id: i,
            suit: suits[i % 4],
            colour: colours[i % 2],
            name: names[i % 13],
            value: values[i % 13]
        };
    }

    // shuffles the deck
    shuffle();

}

// Fisher–Yates shuffle from Mike Bostock
function shuffle() {
    var m = deck.length,
        t, i;

    // While there remain elements to shuffle..
    while (m) {

        // Pick a remaining element..
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = deck[m];
        deck[m] = deck[i];
        deck[i] = t;
    }

}

window.addEventListener("load", start, false);
