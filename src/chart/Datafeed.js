import './indicators/indicators.js'
import {useApiCalls} from "../api/API";


const configurationData = {
    // Represents the resolutions for bars supported by your datafeed
    supported_resolutions: ["1", "5", "15", "240", "D"],
    // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
    exchanges: [
        { value: 'Nexday', name: 'Nexday', desc: 'Nexday' },
        { value: 'ALL', name: 'All types', desc: 'Nexday' },
    ],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [
        { name: 'All', value: 'All', desc: 'Nexday Trade Assistant' },
        { name: 'Forex', value: 'Forex', desc: 'Nexday Trade Assistant' },
        { name: 'Futures', value: 'Futures', desc: 'Nexday Trade Assistant' }
    ],
};
const Datafeed = () => {

    const { getHistoryCandle, getAllProductList} = useApiCalls();

    const  getAllSymbols = async () => {
        let allSymbols = getAllProductList()
            .then(response => {


                if(response && response.data) {
                    return response.data;
                } else {
                    throw new Error(`Network response was not OK, status: ${response}`);
                }
            })
            .then(data => {
                const instrumentsData = data.map(instrument => ({
                    symbol: instrument.symbol,
                    full_name: instrument.symbol,
                    description: instrument.name,
                    exchange: "nexday",
                    type: instrument.securityType,
                }));

                return instrumentsData;

            })
            .catch(error => {
                console.error('Fetch error:', error);
            });

        return allSymbols;
    }
    return {
        onReady: (callback) => {
            console.log('[onReady]: Method call');
            setTimeout(() => callback(configurationData));
        },
        searchSymbols: async (
            userInput,
            exchange,
            symbolType,
            onResultReadyCallback
        ) => {
            const symbols = await getAllSymbols();
            if (symbolType == 'Forex' || symbolType == 'Future') {
                const matchingSymbols = symbols.filter(symbol => {
                    return symbol.type.toLowerCase() === symbolType.toLowerCase();
                });
                onResultReadyCallback(matchingSymbols);
            }

            if (userInput === '' || symbolType == 'All') {
                onResultReadyCallback(symbols);
            } else {
                const matchingSymbols = symbols.filter(symbol => {
                    return (symbol.symbol.toLowerCase().includes(userInput.toLowerCase()) ||
                        symbol.description.toLowerCase().includes(userInput.toLowerCase())); // Use includes for real-time matching
                });

                onResultReadyCallback(matchingSymbols);
            }
        },
        resolveSymbol: async (
            symbolName,
            onSymbolResolvedCallback,
            onResolveErrorCallback,
            extension
        ) => {
            console.log('[resolveSymbol]: Method call', symbolName, configurationData.supported_resolutions);
            const symbols = await getAllSymbols();
            const symbolItem = symbols.find(({ symbol }) => symbol === symbolName);
            if (!symbolItem) {
                console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
                onResolveErrorCallback('Cannot resolve symbol');
                return;
            }

            // Symbol information object
            const symbolInfo = {
                ticker: symbolItem.name,
                name: symbolItem.symbol,
                description: symbolItem.symbol,
                type: symbolItem.securityType,
                session: '24x7',
                timezone: 'Asia/Dubai',
                //exchange: symbolItem.exchange,
                minmov: 1,
                pricescale: 100,
                has_intraday: true,
                visible_plots_set: 'ohlcv',
                has_weekly_and_monthly: false   ,
                supported_resolutions: configurationData.supported_resolutions,
                volume_precision: 2,
                data_status: 'streaming',
            };

            onSymbolResolvedCallback(symbolInfo);
        },
        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
            console.log("GetBard called", symbolInfo, resolution, periodParams)
            const { from, to } = periodParams;
            try {
                getHistoryCandle(symbolInfo.name, resolution, from, to).then(
                    res => {
                        if (!res || !res.data) {
                            // "noData" should be set if there is no data in the requested period
                            onHistoryCallback([], { noData: true });
                            return;
                        }
                        return res.data;
                    }
                ).then(
                    data => {

                        let bars = [];
                        data.forEach(bar => {
                            if (bar.time >= from && bar.time < to) {
                                bars = [...bars, {
                                    time: bar.time * 1000,
                                    low: bar.low,
                                    high: bar.high,
                                    open: bar.open,
                                    close: bar.close,
                                }];
                            }
                        });

                        onHistoryCallback(bars, { noData: false });
                    }
                )

            } catch (error) {
                console.log('[getBars]: Get error', error);
                onErrorCallback(error);
            }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
            console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
        },
        unsubscribeBars: (subscriberUID) => {
            console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        },
    };
}

export default Datafeed;