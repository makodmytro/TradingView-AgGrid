/**
 * Creates a custom TradingView indicator configuration for 'Stop Loss'.
 * This indicator displays the stop loss level as a horizontal line on the chart-original.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {object} A custom indicator configuration object for 'Stop Loss'.
 */
export function createStopLossIndicator(PineJS) {
    return {
        name: 'Stop Loss',
        metainfo: {
            _metainfoVersion: 51,

            id: "StopLoss@tv-basicstudies-1",
            description: "Stop Loss",
            shortDescription: "Stop Loss",

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
                    title: 'Stop Loss',
                    histogramBase: 0,
                }
            },
        },
        constructor: function () {
            this.main = function (context, input) {
                this._context = context;
                this._input = input;
                const l = PineJS.Std.low(this._context) - 26;
                return [l];
            }
        }
    };
}

