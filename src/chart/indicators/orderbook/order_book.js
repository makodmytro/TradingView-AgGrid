/**
 * Creates a custom dropdown widget for selecting order book-related indicators in TradingView.
 *
 * @param {object} widget - The widget object for creating the dropdown.
 */
export function createOrderBookDropdown(widget) {
    widget.createDropdown(
        {
            title: 'Tradebook',
            items: [
                {
                    title: 'Entry Price',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Entry Price',
                            false,
                            false,
                        );
                    },
                },
                {
                    title: 'Stop Loss',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Stop Loss',
                            false,
                            false,
                        );
                    },
                },
                {
                    title: 'Take Profit',
                    onSelect: () => {
                        widget.activeChart().createStudy(
                            'Take Profit',
                            false,
                            false,
                        );
                    },
                },
                // Add other menu items as needed
            ],
        }
    );
}
