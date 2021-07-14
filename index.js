// Here's how a card is represented in Cactus:

// +--------+--------+--------+--------+
// |xxxbbbbb|bbbbbbbb|cdhsrrrr|xxpppppp|
// +--------+--------+--------+--------+

// p = prime number of rank (2 to 41)
// r = rank of card (2 to 14)
// cdhs = bit set for suit of card
// b = bit set for rank of card

// Import lookup tables
const lookupTables = require( "./lookupTables" );
const primeLookup = require( "./primeMultiplicands" );

// Note how suits are represented as set bits
exports.suits = { 8: "Clubs", 4: "Diamonds", 2: "Hearts", 1: "Spades" };

// Let's define each rank (2 to 14/Ace) as a prime number
exports.rankPrimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

// And a function for a card's rank, 2 to 14/Ace
exports.rank = card => ( card >> 8 ) % 16;

// And another for its suit
exports.suit = card => ( card >> 12 ) % 16;

// Now some arrays & a corresponding function for suit/rank/card name strings
// Note the irregular spacing to correspond to how we're representing suits as set bits [ 1, 2, 4, 8 ]
exports.rankNames = [ "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" ];
exports.suitNames = [ null, "Spades", "Hearts", null, "Diamonds", null, null, null, "Clubs" ];
exports.cardName = card => `${ this.rankNames[ this.rank( card ) ] } of ${ this.suitNames[ this.suit( card ) ] }`;

// This is a clever fast way to count bits in an integer courtesy of Sean Eron Anderson
// https://graphics.stanford.edu/~seander/bithacks.html
exports.countBits = bit => {
    const counter = bit - ( ( bit >> 1 ) & 3681400539 ) - ( ( bit >> 2 ) & 1227133513 );
    return ( ( counter + ( counter >> 3 ) ) & 3340530119 ) % 63;
}

// Now here's a function to compile a full deck
// To shuffle, pass anything other than null/undefined/0/NaN/"" as a parameter
exports.fullDeck = shuffled => {
    const result = [];
    for ( let rank = 0; rank < 13; rank++ ) { for ( let suit of [ 8, 4, 2, 1 ] ) {
        // let thisCard = 0;
        // thisCard |= this.rankPrimes[ rank ];
        // thisCard |= rank << 8;
        // thisCard |= suit << 12;
        // thisCard |= ( 1 << rank ) << 16;
        // let thisCard = ( this.rankPrimes[ rank ] ) | ( rank << 8 ) | ( suit << 12 ) | ( ( 1 << rank ) << 16 );
        result.push( ( this.rankPrimes[ rank ] ) | ( rank << 8 ) | ( suit << 12 ) | ( ( 1 << rank ) << 16 ) );
    } };
    if ( !shuffled ) return result;
    for ( let i = 51; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
    }
    return result;
}

// When representing cards this way, bitwise-and-ing everything with 61,440 will result in a 0
// if the hand is not a flush - this is the same as:
// hand => hand[ 0 ] & hand[ 1 ] & hand[ 2 ] & hand[ 3 ] & hand[ 4 ] & 0xF000;
exports.flush = hand => hand.reduce( ( total, card ) => total & card, 0xF000 );

// Here's where it gets interesting

// If a hand is a flush, then bitwise-or-ing everything and shifting it all 16 bits to the right
// will result in a number with exactly five set bits (one for each card) - these are all unique and
// they correspond to a lookup table, flushes[], with the value for each
exports.flushBitPattern = flush => flush.reduce( ( total, card ) => total | card , 0 ) >> 16;
exports.flushRank = flush => lookupTables.flushes[ this.flushBitPattern( flush ) ];

// if the hand isn't a flush or straight flush, let's use a different lookup table to check
// for straights
exports.fiveUniqueCardsRank = hand => lookupTables.fiveUniqueCards[ this.flushBitPattern( hand ) ];

// We've eliminated flushes, straights and high-card hands – let's move on to pairs & threes

// Since we're representing each rank as a prime, the multiplicand of all rank primes together 
// is guaranteed to be unique
exports.primeMultiplicand = hand => hand.reduce( ( total, card ) => total * ( card & 0xFF ), 1 );

// This multiplicand will be way too large for a lookup table so instead we'll speed things up
// to log-n time with this perfect hash lookup function - courtesy of Paul Senzee
// http://senzee.blogspot.com/2006/06/some-perfect-hash.html
// exports.findFast = u => {
//     let a, b, r;
//     u += 0xe91aaa35;
//     u ^= u >> 16;
//     u += u << 8;
//     u ^= u >> 4;
//     b = ( u >> 8 ) & 0x1ff;
//     a = ( u + ( u << 2 ) ) >> 19;
//     r = a ^ lookupTables.hashAdjust[ b ];
//     return Math.abs( r );
// }

// exports.findFast = u => {
//     u += 0xe91aaa35;
//     u ^= u >> 16;
//     u += u << 8;
//     u ^= u >> 4;
//     let a  = ( u + ( u << 2 ) ) >> 19;
//     return Math.abs( a ^ lookupTables.hashAdjust[ ( u >> 8 ) & 0x1ff ] );
// };

// Finally let's tie it all together - first check for flushes, then straights, then pairs/threes
exports.handValue = hand => {
    if ( this.flush( hand ) ) return this.flushRank( hand );
    let fiveUniqueCardsRank = this.fiveUniqueCardsRank( hand );
    if ( fiveUniqueCardsRank ) return fiveUniqueCardsRank;
    return primeLookup.primeMultiplicands[ this.primeMultiplicand( hand ) ];
};

exports.handRank = handValue => {
    if ( handValue > 6185 ) return "High card";        // 1277 high card
    if ( handValue > 3325 ) return "One pair";         // 2860 one pair
    if ( handValue > 2467 ) return "Two pair";         //  858 two pair
    if ( handValue > 1609 ) return "Three of a kind";  //  858 three-kind
    if ( handValue > 1599 ) return "Straight";         //   10 straights
    if ( handValue > 322 )  return "Flush";            // 1277 flushes
    if ( handValue > 166 )  return "Full house";       //  156 full house
    if ( handValue > 10 )   return "Four of a kind";   //  156 four-kind
    return "Straight flush";                           //   10 straight-flushes
};

// A function to generate possible hands (k-combinations)
// https://medium.com/nerd-for-tech/july-2-generating-k-combinations-with-recursion-in-javascript-71ef2b90b44b
exports.possibleHands = ( deck, combinationLength ) => {
    let head, tail, result = [];
    if ( combinationLength > deck.length || combinationLength < 1 ) { return []; }
    if ( combinationLength === deck.length ) { return [ deck ]; }
    if ( combinationLength === 1 ) { return deck.map( element => [ element ] ); }
    for ( let i = 0; i < deck.length - combinationLength + 1; i++ ) {
      head = deck.slice( i, i + 1 );
      tail = this.possibleHands( deck.slice( i + 1 ), combinationLength - 1 );
      for ( let j = 0; j < tail.length; j++ ) { result.push( head.concat( tail[ j ] ) ); }
    }
    return result;
}
