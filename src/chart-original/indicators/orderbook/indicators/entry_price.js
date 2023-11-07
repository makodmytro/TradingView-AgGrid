/**
 * Creates a custom TradingView indicator configuration for 'Entry Price'.
 * This indicator displays the entry price as a horizontal line on the chart-original.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {object} A custom indicator configuration object for 'Entry Price'.
 */
export function createEntryPriceIndicator(PineJS) {
    return {
        name: 'Entry Price',
        metainfo: {
            _metainfoVersion: 51,
    
            id: "EntryPrice@tv-basicstudies-1",
            description: "Entry Price",
            shortDescription: "Entry Price",
    
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
                        color: 'blue',
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
                    title: 'Entry Price',
                    histogramBase: 0,
                }
            },
        },
        constructor: function () {
            this.main = function (context, input) {
                this._context = context;
                this._input = input;
                const l = PineJS.Std.high(this._context) + 30;
                return [l];
            }
        }
    };
}