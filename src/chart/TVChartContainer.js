import {useEffect, useRef} from "react";

import Datafeed from "./Datafeed.js";
import {widget} from "./charting_library";

import './TVChartContainer.css'
import {customIndicatorsGetter} from "./indicators/indicators.js";
import {createPredictiveDropdown} from "./indicators/predictive/predictive_indicators.js";
import {createOrderBookDropdown} from "./indicators/orderbook/order_book.js";

function getLanguageFromURL() {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
export const TVChartContainer = () => {
    const chartContainerRef = useRef();

    const datafeed = Datafeed();

    const defaultProps = {
        // symbol: 'BDTUSD.COMP',
        symbol: 'QGC#',
        interval: '1D',
        libraryPath: '/charting_library/',
        // chartsStorageUrl: 'https://saveload.tradingview.com',
        // chartsStorageApiVersion: '1.1',
        // clientId: 'tradingview.com',
        // userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    };
    const onResolutionChange = (resolution) => {
        console.log('====================>>> onResolutionChange:', resolution);
    }



    useEffect(() => {
        const widgetOptions = {
            symbol: defaultProps.symbol,
            // BEWARE: no trailing slash is expected in feed URL
            // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
            datafeed: datafeed,
            interval: defaultProps.interval,
            container: chartContainerRef.current,
            library_path: defaultProps.libraryPath,
            theme: "dark",
            overrides: {
                "paneProperties.background": "#020024",
                "mainSeriesProperties.style": 1,
                "paneProperties.backgroundGradientStartColor": "#020024",
                "paneProperties.backgroundGradientEndColor": "#4f485e",
            },
            gridColor: "rgba(164, 194, 244, 0.06)",
            // timezone: 'Asia/Dubai',
            locale: getLanguageFromURL() || 'en',
            debug: true,
            // disabled_features: ['use_localstorage_for_settings'],
            // enabled_features: ['legend_widget', 'side_toolbar_in_fullsc'],
            // charts_storage_url: defaultProps.chartsStorageUrl,
            // charts_storage_api_version: defaultProps.chartsStorageApiVersion,
            // client_id: defaultProps.clientId,
            // user_id: defaultProps.userId,
            fullscreen: defaultProps.fullscreen,
            autosize: defaultProps.autosize,
            studies_overrides: defaultProps.studiesOverrides,
            custom_indicators_getter: customIndicatorsGetter,
            onResolutionChange: onResolutionChange,

        };
        const tvWidget = new widget(widgetOptions);


        tvWidget.onChartReady(() => {

            tvWidget.headerReady().then(() => {

                //create dropdown for predictive Indicators
                createPredictiveDropdown(tvWidget);
                //create dropdown for order book
                createOrderBookDropdown(tvWidget);
            });
        });

        // return () => {
        //     tvWidget.remove();
        // };
    }, [datafeed]);

    return (
        <div
            ref={chartContainerRef}
            className={'TVChartContainer'}
        />
    );
}

export default TVChartContainer;