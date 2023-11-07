export function customIndicatorsGetter {

    name: 'Predicted Strength',
    metainfo: {
        _metainfoVersion: 51,

        id: "PredictedStrength@tv-basicstudies-1",
        description: "Predicted Strength",
        shortDescription: "Predicted Strength",

        isCustomIndicator: true,
        is_price_study: false,

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
                    trackPrice: true,
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
                title: 'Predicted Strength',
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