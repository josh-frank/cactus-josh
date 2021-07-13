const cactus = require( "." );

const testDeck = cactus.fullDeck( true );
const testHand = testDeck.slice( 0, 5 );
const testFlush = [ 295426, 557827, 1082373, 2131207, 4228619 ];

// test( "", () => {
//     expect().toBe();
// } );

test( "flush( hand ) returns true in case of a five-card flush and false otherwise", () => {
    // console.log( testHand.map( cactus.cardName ) );
    // console.log( cactus.flush( testHand ) );
    expect( !!cactus.flush( testFlush ) ).toBe( true );
    // console.log( cactus.flushRank( testFlush ) );
    // console.log( cactus.fiveUniqueCardsRank( testFlush ) );
} );

test( "primeMultiplicand( hand ) returns the hand's prime values multiplied together", () => {
    // console.log( testFlush.map( card => card & 0xFF ) );
    // console.log( cactus.primeMultiplicand( testFlush ) );
    expect( cactus.primeMultiplicand( testFlush ) ).toBe( 2310 );
} );

test( "handValue( hand ) returns the hand's rank from 1 to 7,462", () => {
    console.log( testHand.map( cactus.cardName ) );
    console.log( cactus.handValue( testHand ) );
    console.log( cactus.handRank( cactus.handValue( testHand ) ) );
    // expect().toBe();
} );

// console.log( testFlush );
// console.log( flush( testFlush ) );