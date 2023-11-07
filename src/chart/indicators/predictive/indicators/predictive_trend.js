/**
 * Creates a custom TradingView indicator configuration for 'Predicted Trend'.
 * This indicator displays the predicted trend as a colored area between two lines on the chart-original.
 *
 * @param {object} PineJS - The Pine Script object for the current chart-original.
 * @returns {object} A custom indicator configuration object for 'Predicted Trend'.
 */
export function createPredictedTrendIndicator(PineJS) {
    return {
        name: 'Predicted Trend',
        metainfo: {
            _metainfoVersion: 51,
            id: 'PredictedTrend@tv-basicstudies-1',
            description: 'Predicted Trend',
            shortDescription: 'Predicted Trend',
            is_price_study: false,
            isCustomIndicator: true,
            plots: [
                {
                    id: 'plot_0',
                    type: 'line',
                },
                {
                    id: 'plot_1',
                    type: 'line',
                },
                {
                    id: 'plot_2',
                    type: 'colorer',
                    target: 'filledAreaId1',
                    palette: 'paletteId1',
                },
            ],

            filledAreas: [
                {
                    id: 'filledAreaId1',
                    objAId: 'plot_0',
                    objBId: 'plot_1',
                    title: 'Filled area between first and second plot',
                    type: 'plot_plot',
                    palette: 'paletteId1',
                },
            ],

            palettes: {
                paletteId1: {
                    valToIndex: {
                        0: 0,
                        1: 1,
                    },
                    colors: {
                        0: {
                            name: 'Down',
                        },
                        1: {
                            name: 'Up',
                        },
                    },
                },
            },
            defaults: {

                filledAreasStyle: {
                    filledAreaId1: {
                        color: 'yellow',
                        visible: true,
                        transparency: 10,

                    },
                },

                palettes: {
                    paletteId1: {
                        colors: {
                            0: {
                                color: 'red',
                                width: 1,
                                style: 1,
                            },
                            1: {
                                color: 'green',
                                width: 1,
                                style: 1,
                            },
                        },
                    },
                },

                styles:
                {
                    plot_0: {
                        linestyle: 0,
                        visible: true,
                        linewidth: 1,
                        plottype: 2,
                        trackPrice: true,
                        color: 'red'
                    },
                    plot_1: {
                        linestyle: 0,
                        visible: true,
                        linewidth: 1,
                        plottype: 2,
                        trackPrice: true,
                        color: 'green'
                    },
                },
                precision: 0,
                inputs: {}
            },
            styles:
            {
                plot_0:
                {
                    title: 'Down Trend',
                    histogramBase: 0,
                },
                plot_1:
                {
                    title: 'Up Trend',
                    histogramBase: 0,
                },
            },
            inputs: [],
            format: {
                type: 'volume',
            },
        },
        constructor: function () {
            this.main = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;

                const h = PineJS.Std.high(this._context);
                const l = PineJS.Std.low(this._context);

                const customValue = h - l;
                var colorIndex = customValue > 20 ? 0 : 1;

                return [0, 1, colorIndex];
            }
        }
    };
}

