
// Importing custom indicators

// Order Book
import { createStopLossIndicator } from '../indicators/orderbook/indicators/stop_loss.js'
import { createTakeProfitIndicator } from '../indicators/orderbook/indicators/take_profit.js'
import { createPredictedLowIndicator } from '../indicators/predictive/indicators/predictive_low.js'

// Predictive 
import { createPredictedStrengthIndicator } from '../indicators/predictive/indicators/predective_strength.js'
import { createPredictedTrendIndicator } from '../indicators/predictive/indicators/predictive_trend.js'
import { createPredictedHighIndicator } from '../indicators/predictive/indicators/predictive_high.js'
import { createEntryPriceIndicator } from '../indicators/orderbook/indicators/entry_price.js'


/**
 * Retrieves and returns an array of custom indicators for TradingView.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {Promise} A promise that resolves to an array of custom indicator configurations.
 */
export function customIndicatorsGetter(PineJS) {
    return Promise.resolve([
        // Order Book
        createEntryPriceIndicator(PineJS),
        createStopLossIndicator(PineJS),
        createTakeProfitIndicator(PineJS),

        //Prdictive
        createPredictedHighIndicator(PineJS),
        createPredictedLowIndicator(PineJS),
        createPredictedTrendIndicator(PineJS),
        createPredictedStrengthIndicator(PineJS),


    ]);
}