// Here's how a card is represented in Cactus:

// +--------+--------+--------+--------+
// |xxxbbbbb|bbbbbbbb|cdhsrrrr|xxpppppp|
// +--------+--------+--------+--------+

// p = prime number of rank (2 to 41)
// r = rank of card (2 to 14)
// cdhs = bit set for suit of card
// b = bit set for rank of card

// Note how suits are represented as set bits
exports.suits = { 8: "Clubs", 4: "Diamonds", 2: "Hearts", 1: "Spades" };

// Let's define each rank (2 to 14/Ace) as a prime number
exports.rankPrimes = [ null, null, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

// And a function for a card's rank, 2 to 14/Ace
exports.rank = card => ( card >> 8 ) % 16;

// And another for its suit
exports.suit = card => ( card >> 12 ) % 16;

// Now some arrays & a corresponding function for suit/rank/card name strings
// Note the irregular spacing
exports.rankNames = [ null, null, "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" ];
exports.suitNames = [ null, "Spades", "Hearts", null, "Diamonds", null, null, null, "Clubs" ];
exports.cardName = card => `${ this.rankNames[ this.rank( card ) ] } of ${ this.suitNames[ this.suit( card ) ] }`;

// This is A clever fast way to count bits in an integer courtesy of Sean Eron Anderson
// https://graphics.stanford.edu/~seander/bithacks.html
exports.countBits = bit => {
    const counter = bit - ( ( bit >> 1 ) & 3681400539 ) - ( ( bit >> 2 ) & 1227133513 );
    return ( ( counter + ( counter >> 3 ) ) & 3340530119 ) % 63;
}

// A function to compile a full deck
// To shuffle, pass anything other than null/undefined/0/NaN/"" as a parameter
exports.fullDeck = shuffled => {
    const result = [];
    for ( let rank = 2; rank < 15; rank++ ) {
        for ( let suit of [ 8, 4, 2, 1 ] ) {
            let thisCard = 0;
            thisCard |= this.rankPrimes[ rank ];
            thisCard |= rank << 8;
            thisCard |= suit << 12;
            thisCard |= ( 1 << rank ) << 16;
            result.push( thisCard );
        }
    }
    if ( !shuffled ) return result;
    for ( let i = 51; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
    }
    return result;
}

// When representing cards this way, bitwise-and-ing everything with 61,440
// will result in a 0 if the hand is not a flush - this is the same as:
// hand => hand[ 0 ] & hand[ 1 ] & hand[ 2 ] & hand[ 3 ] & hand[ 4 ] & 0xF000;
exports.flush = hand => hand.reduce( ( total, card ) => total & card, 0xF000 );
