
/**
 * Creates a custom TradingView indicator configuration for 'Predicted Low'.
 * This indicator displays the predicted low price as a line on the chart-original.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {object} A custom indicator configuration object for 'Predicted Low'.
 */
export function createPredictedLowIndicator(PineJS) {
    return {
        name: 'Predicted Low',
        metainfo: {
            _metainfoVersion: 51,

            id: "PredictedLow@tv-basicstudies-1",
            description: "Predicted Low",
            shortDescription: "Predicted Low",

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
                        color: 'red',
                        trackPrice: false,
                    }
                },
            },
            inputs: [],
            plots: [{
                id: 'plot_0',
                type: 'line',
            }
            ],
            styles: {
                plot_0: {
                    title: 'Predicted Low',
                    histogramBase: 0,
                }
            },
        },
        constructor: function () {
            this.main = function (context, input) {
                this._context = context;
                this._input = input;
                const l = PineJS.Std.low(this._context) - 30;
                return [l];
            }
        }
    };
}