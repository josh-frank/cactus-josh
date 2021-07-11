// +--------+--------+--------+--------+
// |xxxbbbbb|bbbbbbbb|cdhsrrrr|xxpppppp|
// +--------+--------+--------+--------+

// p = prime number of rank (2 to 41)
// r = rank of card (2 to 14)
// cdhs = bit set for suit of card
// b = bit set for rank of card

const rankPrimes = [ null, null, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

const countBits = bit => {
    const counter = bit - ( ( bit >> 1 ) & 3681400539 ) - ( ( bit >> 2 ) & 1227133513 );
    return ( ( counter + ( counter >> 3 ) ) & 3340530119 ) % 63;
}

const fullDeck = shuffled => {
    const result = [];
    for ( let rank = 2; rank < 15; rank++ ) {
        for ( let suit of [ 1, 2, 4, 8 ] ) {
            let thisCard = 0;
            thisCard |= rankPrimes[ rank ];
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

const flush = hand => {
    return hand[0] && hand[1] && hand[2] && hand[3] && hand[4] && 0xF000;
}

console.log( fullDeck().map( card => card.toString( 2 ) ) );
console.log( fullDeck().length );
