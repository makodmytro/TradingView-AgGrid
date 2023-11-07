
/**
 * Creates a custom TradingView indicator configuration for 'Predicted High'.
 * This indicator displays the predicted high price as a line on the chart-original.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {object} A custom indicator configuration object for 'Predicted High'.
 */
export function createPredictedHighIndicator(PineJS) {
    return {
        name: 'Predicted High',
        metainfo: {
            _metainfoVersion: 51,

            id: "PredictedHigh@tv-basicstudies-1",
            description: "Predicted High",
            shortDescription: "Predicted High",

            isCustomIndicator: true,
            is_price_study: true,

            format: {
                type: 'price',
                precision: 1,
            },

            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        visible: true,
                        linewidth: 2,
                        plottype: 9,
                        color: 'green',
                        trackPrice: false,
                    },
                },
            },
            inputs: [],
            plots: [{
                id: 'plot_0',
                type: 'line',
            }],
            styles: {
                plot_0: {
                    title: 'Predicted High',
                    histogramBase: 0,
                }
            },
        },
        constructor: function () {
            this.main = function (context, input) {
                this._context = context;
                this._input = input;

                const h = PineJS.Std.high(this._context) + 30;
                return [h];
            }
        }
    };
}

