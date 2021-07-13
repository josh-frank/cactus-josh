/*
const fullDeck = [
//  clubs      diamonds   hearts     spades
    98306,     81922,     73730,     69634,         // 2
    164099,    147715,    139523,    135427,        // 3
    295429,    279045,    270853,    266757,        // 4
    557831,    541447,    533255,    529159,        // 5
    1082379,   1065995,   1057803,   1053707,       // 6
    2131213,   2114829,   2106637,   2102541,       // 7
    4228625,   4212241,   4204049,   4199953,       // 8
    8423187,   8406803,   8398611,   8394515,       // 9
    16812055,  16795671,  16787479,  16783383,      // T
    33589533,  33573149,  33564957,  33560861,      // J
    67144223,  67127839,  67119647,  67115551,      // Q
    134253349, 134236965, 134228773, 134224677,     // K
    268471337, 268454953, 268446761, 268442665      // A
];
*/

const cactus = require( "." );

const testDeck = cactus.fullDeck( true );

const testHands = {
    randomHand: testDeck.slice( 0, 5 ),
    queenHighStraight: [ 67115551, 33564957, 16795671, 8406803, 4199953 ],
    tenHighFlush: [ 16812055, 4228625, 268471337, 164099, 295429 ],
    sevenHighStraightFlush: [ 295426, 557827, 1082373, 2131207, 4228619 ],
    fourTens: [ 16812055, 16795671, 16787479, 16783383, 1053707 ],
    tensFullaSixes: [ 16812055, 16795671, 16787479, 1082379, 1053707 ],
};

// test( "", () => {
//     expect( true ).toBe( true );
// } );

test( "flush( hand ) returns true in case of a five-card flush and false otherwise", () => {
    // console.log( testHands.randomHand.map( cactus.cardName ) );
    // console.log( cactus.flush( testHands.randomHand ) );
    expect( !!cactus.flush( testHands.sevenHighStraightFlush ) ).toBe( true );
    // console.log( cactus.flushRank( testHands.sevenHighStraightFlush ) );
    // console.log( cactus.fiveUniqueCardsRank( testHands.sevenHighStraightFlush ) );
} );

test( "primeMultiplicand( hand ) returns the hand's prime values multiplied together", () => {
    // console.log( testHands.sevenHighStraightFlush ].map( card => card & 0xFF ) );
    // console.log( cactus.primeMultiplicand( testHands.sevenHighStraightFlush ] ) );
    expect( cactus.primeMultiplicand( testHands.sevenHighStraightFlush ) ).toBe( 2310 );
    expect( cactus.primeMultiplicand( testHands.fourTens ) ).toBe( 3078251 );
} );

test( "handValue( hand ) returns the hand's rank from 1 to 7,462", () => {
    console.log( testHands.tensFullaSixes.map( cactus.cardName ) );
    console.log( cactus.handValue( testHands.tensFullaSixes ) );
    // console.log( cactus.primeMultiplicand( testHands.tensFullaSixes ) );
    console.log( cactus.handRank( cactus.handValue( testHands.tensFullaSixes ) ) );
    // expect().toBe();
} );
