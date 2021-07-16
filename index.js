const { flushes, fiveUniqueCards, hashAdjust, hashValues } = require( "./lookupTables" );

exports.suits = { 8: "Clubs", 4: "Diamonds", 2: "Hearts", 1: "Spades" };
exports.rankPrimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

exports.rank = card => ( card >>> 8 ) % 16;
exports.suit = card => ( card >>> 12 ) % 16;

exports.rankNames = [ "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" ];
exports.suitNames = [ null, "Spades", "Hearts", null, "Diamonds", null, null, null, "Clubs" ];
exports.cardName = card => `${ this.rankNames[ this.rank( card ) ] } of ${ this.suitNames[ this.suit( card ) ] }`;

exports.fullDeck = shuffled => {
    const result = [];
    for ( let rank = 0; rank < 13; rank++ ) for ( let suit of [ 8, 4, 2, 1 ] )
        result.push( ( this.rankPrimes[ rank ] ) | ( rank << 8 ) | ( suit << 12 ) | ( ( 1 << rank ) << 16 ) );
    if ( !shuffled ) return result;
    for ( let i = 51; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
    }
    return result;
}

exports.flush = hand => hand.reduce( ( total, card ) => total & card, 0xF000 );

exports.flushBitPattern = flush => flush.reduce( ( total, card ) => total | card , 0 ) >>> 16;
exports.flushRank = flush => flushes[ this.flushBitPattern( flush ) ];
exports.fiveUniqueCardsRank = hand => fiveUniqueCards[ this.flushBitPattern( hand ) ];
exports.primeMultiplicand = hand => hand.reduce( ( total, card ) => total * ( card & 0xFF ), 1 );

exports.findFast = u => {
    u += 0xe91aaa35;
    u ^= u >>> 16;
    u += u << 8;
    u ^= u >>> 4;
    let a  = ( u + ( u << 2 ) ) >>> 19;
    return a ^ hashAdjust[ ( u >>> 8 ) & 0x1ff ];
};

exports.handRank = hand => {
    if ( this.flush( hand ) ) return this.flushRank( hand );
    let fiveUniqueCardsRank = this.fiveUniqueCardsRank( hand );
    if ( fiveUniqueCardsRank ) return fiveUniqueCardsRank;
    return hashValues[ this.findFast( this.primeMultiplicand( hand ) ) ];
};

exports.handValue = hand => {
    const rank = this.handRank( hand );
    if ( rank > 6185 ) return "High card";
    else if ( rank > 3325 ) return "One pair";
    else if ( rank > 2467 ) return "Two pair";
    else if ( rank > 1609 ) return "Three of a kind";
    else if ( rank > 1599 ) return "Straight";
    else if ( rank > 322 )  return "Flush";
    else if ( rank > 166 )  return "Full house";
    else if ( rank > 10 )   return "Four of a kind";
    else return "Straight flush";
};

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
