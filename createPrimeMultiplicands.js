const fs = require( "fs" );

const cactus = require( "." );

const possibleFiveCardHands = cactus.possibleHands( cactus.fullDeck(), 5 );
const possibleFiveCardMultiplicands = possibleFiveCardHands.map( hand => cactus.primeMultiplicand( hand ) );

fs.writeFileSync( "primeMultiplicands.js", `exports.primeMultiplicands = [\n${
    [ ...new Set( possibleFiveCardMultiplicands ) ].join( `,\n` )
}\n]` );
