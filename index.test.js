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
    fiveHighStraight: [ 164099, 268442665, 81922, 279045, 529159 ],
    threeJacks: [ 33589533, 33564957, 33560861, 533255, 2102541 ],
    ninesAndSevens: [ 2114829, 2106637, 8398611, 8394515, 268471337 ],
    pairOfDeuces: [ 98306, 4212241, 81922, 529159, 33589533 ],
};

// test( "", () => {
//     expect( true ).toBe( true );
// } );

test( "flush( hand ) returns true in case of a five-card flush and false otherwise", () => {
    expect( !!cactus.flush( testHands.sevenHighStraightFlush ) ).toBe( true );
} );

test( "primeMultiplicand( hand ) returns the hand's prime values multiplied together", () => {
    expect( cactus.primeMultiplicand( testHands.sevenHighStraightFlush ) ).toBe( 2310 );
    expect( cactus.primeMultiplicand( testHands.fourTens ) ).toBe( 3078251 );
} );

test( "handValue( hand ) correctly evaluates all 2,598,960 five-card poker hands", () => {
    const possibleHands = cactus.possibleHands( testDeck, 5 );
    const fiveCardHistogram = { highCard: 0, onePair: 0,  twoPair: 0,  threeOfAKind: 0,  straight: 0,  flush: 0,  fullHouse: 0,  fourOfAKind: 0, straightFlush: 0 };
    for ( let hand of possibleHands ) switch ( cactus.handRank( cactus.handValue( hand ) ) ) {
        case "Straight flush": fiveCardHistogram.straightFlush++; break;
        case "Four of a kind": fiveCardHistogram.fourOfAKind++; break;
        case "Full house": fiveCardHistogram.fullHouse++; break;
        case "Flush": fiveCardHistogram.flush++; break;
        case "Straight": fiveCardHistogram.straight++; break;
        case "Three of a kind": fiveCardHistogram.threeOfAKind++; break;
        case "Two pair": fiveCardHistogram.twoPair++; break;
        case "One pair": fiveCardHistogram.onePair++; break;
        case "High card": fiveCardHistogram.highCard++; break;
        default: break;
    }
    expect( fiveCardHistogram.straightFlush ).toBe( 40 );
    expect( fiveCardHistogram.fourOfAKind ).toBe( 624 );
    expect( fiveCardHistogram.fullHouse ).toBe( 3744 );
    expect( fiveCardHistogram.flush ).toBe( 5108 );
    expect( fiveCardHistogram.straight ).toBe( 10200 );
    expect( fiveCardHistogram.threeOfAKind ).toBe( 54912 );
    expect( fiveCardHistogram.twoPair ).toBe( 123552 );
    expect( fiveCardHistogram.onePair ).toBe( 1098240 );
    expect( fiveCardHistogram.highCard ).toBe( 1302540 );
} );

test( "handRank( hand ) uses handValue( hand ) to correctly return the hand's rank as a string", () => {
    console.log( testHands.randomHand.map( cactus.cardName ) );
    console.log( cactus.handValue( testHands.randomHand ) );
    console.log( cactus.handRank( cactus.handValue( testHands.randomHand ) ) );
    expect( cactus.handRank( cactus.handValue( testHands.queenHighStraight ) ) ).toBe( "Straight" );
    expect( cactus.handRank( cactus.handValue( testHands.tenHighFlush ) ) ).toBe( "Flush" );
    expect( cactus.handRank( cactus.handValue( testHands.sevenHighStraightFlush ) ) ).toBe( "Straight flush" );
    expect( cactus.handRank( cactus.handValue( testHands.fourTens ) ) ).toBe( "Four of a kind" );
    expect( cactus.handRank( cactus.handValue( testHands.tensFullaSixes ) ) ).toBe( "Full house" );
    expect( cactus.handRank( cactus.handValue( testHands.fiveHighStraight ) ) ).toBe( "Straight" );
    expect( cactus.handRank( cactus.handValue( testHands.threeJacks ) ) ).toBe( "Three of a kind" );
    expect( cactus.handRank( cactus.handValue( testHands.ninesAndSevens ) ) ).toBe( "Two pair" );
    expect( cactus.handRank( cactus.handValue( testHands.pairOfDeuces ) ) ).toBe( "One pair" );
} );
