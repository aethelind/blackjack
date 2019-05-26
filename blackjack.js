// Deck of cards info:
var deck = [];
var suits = ["♠️", "♥︎", "♣︎", "♦︎"];
var colours = ["#444", "#E85A4F"];
var names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];


var hand = [];

// true when theres NOT a "no more cards" message printed
var flag = true;
var sum = 0;
var gameover = false;

// hands are soft unless they become hard
var soft = true;

var wins = 0;
var loses = 0;

function start() {
    var newButton = document.getElementById("new");
    newButton.addEventListener("click", hit, false);

    //var shuffButton = document.getElementById("shuff");
    //shuffButton.addEventListener("click", shuffle, false);

    //var clrButton = document.getElementById("clr");
    //clrButton.addEventListener("click", clear, false);

    setDeck();
    hit();
}

function clear() {
    var cardDiv = document.getElementById("card");
    cardDiv.innerHTML = "";

    setDeck();
    flag = true;

    sum = 0;
    var sumDiv = document.getElementById("sum")
    sumDiv.innerHTML = "Total: " + sum;
    var addDiv = document.getElementById("addition")
    addDiv.innerHTML = "( )";
    hand = []
    soft = true;
}

function hit() {
    // check that deck isn't empty.
    if (deck.length == 0) {
        if (flag) {
            var cardDiv = document.getElementById("card");
            cardDiv.innerHTML += "<h3>No more cards!</h3>";
            flag = false;
        }

        return;
    }
    if (gameover) {
        clear();
        gameover = false;
    }

    // pop top card, which removes it from the deck.   
    var card = deck.pop();

    // store it in the hand
    hand.push(card);

    // display card on table
    var cardDiv = document.getElementById("card");
    cardDiv.innerHTML += "<div style='color:" + card.colour + ";'>" + card.name + " " + card.suit + "</div>";

    if (sum + card.value == 21) {
        cardDiv.innerHTML += "<div style='color:#3B945E;'> Winner! </div>";
        wins++;
        gameover = true;
    } else if (sum + card.value > 21) {
        // !! i think this isn't logically correct, but for now the situation it fails in is unlikely??
        var aces = false;
        // check the hand for aces, if it does then change the aces value to 1.
        soft = false
        for (var i = 0; i < hand.length; i++) {
            if (hand[i].value == 11) {
                hand[i].value = 1;
                soft = true;
            }
        }

        // if there were no aces to change, then they lose.
        if (!soft) {
            cardDiv.innerHTML += "<div style='color:#777;'> You Lose! </div>";
            loses++;
            gameover = true;
        }



    }

    // increase hand's sum
    sum += card.value;
    var sumDiv = document.getElementById("sum")
    sumDiv.innerHTML = "Total: " + sum;

    // show hand calculation
    var addDiv = document.getElementById("addition")
    addDiv.innerHTML = "(";
    for (var i = 0; i < hand.length; i++) {
        addDiv.innerHTML += hand[i].value;
        if (i != hand.length - 1) {
            addDiv.innerHTML += ", "
        }
    }
    addDiv.innerHTML += ")";
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
