const fs = require( "fs" );

const cactus = require( "." );

function value( hand ) {
    const countByPair = [ 0, 0, 0, 0 ];
    const countBySuit = [ 0, 0, 0, 0 ];
    let score = 0;
    hand.forEach( card => {
        countBySuit[ cactus.suit( card ) ] |= ( 1 << cactus.rank( card ) );
        let total = 0;
        countBySuit.forEach( suit => { total += ( suit >> cactus.rank( card ) ) & 1; } );
        if ( total === 4 ) { score = 8; }
        countByPair[ total ] ^= 1 << cactus.rank( card );
        countByPair[ total - 1 ] ^= 1 << cactus.rank( card );
    } );
    if ( !!score ) { return score; }
    countBySuit.forEach( suit => {
        if ( suit >= 31744 ) { score = 10; }
        while ( suit != 0 && suit % 2 === 0 ) { suit >>= 1; }
        if ( ( suit % 32 == 31 || ( suit % 32 == 15 && suit > 4096 ) ) && !score ) { score = 9; }
        if ( cactus.countBits( suit ) >= 5 && !score ) { score = 6; }
    } );
    if ( !!score ) { return score; }
    while ( countByPair[ 0 ] % 2 === 0 ) { countByPair[ 0 ] >>= 1; }
    if ( countByPair[ 0 ] % 32 == 31 || ( countByPair[ 0 ] % 32 == 15 && countByPair[ 0 ] > 4096 ) ) { score = 5; }
    else if ( ( cactus.countBits( countByPair[ 2 ] ) > 0 && cactus.countBits( countByPair[ 3 ] ) > 0 ) || cactus.countBits( countByPair[ 3 ] ) > 1 ) { score = 7; }
    else if ( cactus.countBits( countByPair[ 3 ] ) > 0 ) { score = 4; }
    else if ( cactus.countBits( countByPair[ 2 ] ) > 1 ) { score = 3; }
    else if ( countByPair[ 2 ] >= 2048 ) { score = 2; }
    else if ( cactus.countBits( countByPair[ 2 ] ) > 0 ) { score = 1; }
    else { score = 0; }
    return score;
}

const possibleFiveCardHands = cactus.possibleHands( cactus.fullDeck(), 5 );
const possibleFiveCardMultiplicands = {};
for ( let hand of possibleFiveCardHands ) possibleFiveCardMultiplicands[ cactus.primeMultiplicand( hand ) ] = value( hand );

// const possibleFiveCardMultiplicands = possibleFiveCardHands.map( hand => [ cactus.primeMultiplicand( hand ), value( hand ) ] );

fs.writeFileSync( "primeMultiplicands.js", [
        "exports.primeMultiplicands = {",
        ...Object.keys( possibleFiveCardMultiplicands ).map( multiplicand => `\t${ multiplicand }: ${ possibleFiveCardMultiplicands[ multiplicand ] },` ),
        "};"
    ].join( "\n" )
);
