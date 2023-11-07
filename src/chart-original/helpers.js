/**
 * Makes requests to the CryptoCompare API.
 *
 * @param {string} path - The path to the API endpoint.
 * @returns {Promise} A promise that resolves to the JSON response from the API.
 */
export async function makeApiRequest(path) {
    try {
        const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
        // console.log(response.json());

        return response.json();


    } catch (error) {
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

/**
 * Generates a symbol ID from a pair of coins.
 *
 * @param {string} exchange - The exchange where the trading pair is available.
 * @param {string} fromSymbol - The symbol of the base coin.
 * @param {string} toSymbol - The symbol of the quote coin.
 * @returns {object} An object containing short and full symbol representations.
 */
export function generateSymbol(exchange, fromSymbol, toSymbol) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

/**
 * Parses a full symbol name into its components.
 *
 * @param {string} fullSymbol - The full symbol name in the format 'exchange:fromSymbol/toSymbol'.
 * @returns {object|null} An object containing exchange, fromSymbol, and toSymbol, or null if the format is invalid.
 */
export function parseFullSymbol(fullSymbol) {
    console.log('Symbol full name', fullSymbol);

    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }
    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}

/**
 * Removes specified suffixes from an array of symbols.
 *
 * @param {string[]} symbolsArray - An array of symbol names.
 * @param {string[]} suffixes - An array of suffixes to remove from the symbols.
 * @returns {string[]} An array of modified symbol names with suffixes removed.
 */
export function removeSuffixFromSymbols(symbolsArray, suffixes) {
    return symbolsArray.map(symbol => {
        let modifiedSymbol = symbol;
        suffixes.forEach(suffix => {
            modifiedSymbol = modifiedSymbol.replace(new RegExp(`\\${suffix}.*`), '');
        });
        return modifiedSymbol;
    });
}