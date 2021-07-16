# cactus-josh

`cactus-josh` is a JavaScript implementation of the classic [CactusKev](http://suffe.cool/poker/evaluator.html) poker hand evaluator, originally written in C by [Kevin Suffecool](https://suffe.cool/). One of the cleverest bits of code ever written, this algorithm represents the 52 cards of a French deck with unsigned 32-bit d-words, each of which corresponds to a prime number. It then uses bitshifting and lookup tables to calculate the value of a hand of five cards. It's **insanely** fast!

## Instructions for use

Install/require, then generate a new deck with `fullDeck()`. Convert each card to a string with `cardName( card )`:

```
const cactus = require( "cactus-josh" );

// pass any non-null argument to shuffle the deck
const shuffledDeck = cactus.fullDeck( true );

const drawFive = shuffledDeck.slice( 0, 5 );

console.log( drawFive.map( cactus.cardName ) );
--> [ 'Nine of Clubs', 'Ten of Clubs', 'Six of Clubs', 'Nine of Diamonds', 'Five of Diamonds' ]
```

There are 2,598,960 (52-combination-5) possible five-card hands. Each hand has a unique rank, from 7,462 (the lowest possible hand) to 1 (a royal flush of spades). Use `handValue( hand )` to return a hand's number rank, and `handRank( hand )` to return a string of the hand type:

```
console.log( cactus.handValue( drawFive ) ) );
--> 4601

console.log( cactus.handRank( drawFive ) ) );
--> One pair
```