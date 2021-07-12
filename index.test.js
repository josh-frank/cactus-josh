const cactus = require( "." );

// const testDeck = cactus.fullDeck( true );
// const testHand = testDeck.slice( 0, 5 );
const testFlush = [ 295426, 557827, 1082373, 2131207, 4228619 ];

// test( "", () => {
//     expect().toBe();
// } );

test( "flush( hand ) returns true in case of a five-card flush and false otherwise", () => {
    // console.log( testHand.map( cactus.cardName ) );
    // console.log( cactus.flush( testHand ) );
    expect( !!cactus.flush( testFlush ) ).toBe( true );
    console.log( cactus.flushRank( testFlush ) );
} );

// console.log( testFlush );
// console.log( flush( testFlush ) );