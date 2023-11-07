/**
 * Creates a custom TradingView indicator configuration for 'Take Profit'.
 * This indicator displays the take profit level as a horizontal line on the chart-original.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {object} A custom indicator configuration object for 'Take Profit'.
 */
export function createTakeProfitIndicator(PineJS) {
    return {
        name: 'Take Profit',
        metainfo: {
            _metainfoVersion: 51,

            id: "TakeProfit@tv-basicstudies-1",
            description: "Take Profit",
            shortDescription: "Take Profit",

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
                    title: 'Take Profit',
                    histogramBase: 0,
                }
            },
        },
        constructor: function () {
            this.main = function (context, input) {
                this._context = context;
                this._input = input;
                const l = PineJS.Std.high(this._context) + 60;
                return [l];
            }
        }
    };
}