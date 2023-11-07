
import Datafeed from './datafeed.js';
import { customIndicatorsGetter } from './indicators/indicators.js';
import { createOrderBookDropdown } from './indicators/orderbook/order_book.js'
import { createPredictiveDropdown } from './indicators/predictive/predictive_indicators.js'

let widget;

// Initialize the TradingView widget
widget = new TradingView.widget({
    symbol: 'QGC#',
    container: 'chartContainer',
    locale: 'en',
    library_path: 'charting_library/',
    datafeed: Datafeed,
    interval: '1D',
    fullscreen: true,
    debug: false,
    theme: "dark",
    overrides: {
        "paneProperties.background": "#020024",
        "mainSeriesProperties.style": 1,
        "paneProperties.backgroundGradientStartColor": "#020024",
        "paneProperties.backgroundGradientEndColor": "#4f485e",
    },
    gridColor: "rgba(164, 194, 244, 0.06)",
    timezone: 'Asia/Dubai',
    studies_overrides: {
        // Modify the style of the "Predicted High" line
        //"Predicted Trend.filledAreaId1.color": "#FF0000",
        //"Predicted Trend.Second plot.color": "#0000FF",
        //"Predicted Low.Predicted Low.color": "#020024",
    },

    custom_indicators_getter: customIndicatorsGetter
});

// Wait for the widget header to be ready and then create dropdowns
widget.headerReady().then(function () {
    //create dropdown for predictive Indicators
    createPredictiveDropdown(widget);
    //create dropdown for order book
    createOrderBookDropdown(widget);
});

