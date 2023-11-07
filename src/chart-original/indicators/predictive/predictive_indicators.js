/**
 * Creates a custom dropdown widget for selecting predictive indicators in TradingView.
 *
 * @param {object} widget - The widget object for creating the dropdown.
 */
export function createPredictiveDropdown(widget) {
    widget.createDropdown(
        {
            title: 'Predictive Indicators',
            items: [
                {
                    title: 'Predicted High',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Predicted High',
                            false,
                            false,
                        );
                    },
                },
                {
                    title: 'Predicted Low',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Predicted Low',
                            false,
                            false,
                        );
                    },
                },
                {
                    title: 'Predicted Strength',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Predicted Strength',
                            false,
                            false,
                        );
                    },
                },
                {
                    title: 'Predicted Trend',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Predicted Trend',
                            false,
                            false,
                        );
                    },
                }
            ],
        }
    );
}
