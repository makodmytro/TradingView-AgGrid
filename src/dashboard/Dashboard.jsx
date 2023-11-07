/* eslint-disable */
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {CsvExportModule} from '@ag-grid-community/csv-export';
import {AgGridReact} from '@ag-grid-community/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import {GridChartsModule} from '@ag-grid-enterprise/charts';
import {ClipboardModule} from '@ag-grid-enterprise/clipboard';
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {FiltersToolPanelModule} from '@ag-grid-enterprise/filter-tool-panel';
import {MasterDetailModule} from '@ag-grid-enterprise/master-detail';
import {MenuModule} from '@ag-grid-enterprise/menu';
import {MultiFilterModule} from '@ag-grid-enterprise/multi-filter';
import {RangeSelectionModule} from '@ag-grid-enterprise/range-selection';
import {RichSelectModule} from '@ag-grid-enterprise/rich-select';
import {RowGroupingModule} from '@ag-grid-enterprise/row-grouping';
import {SetFilterModule} from '@ag-grid-enterprise/set-filter';
import {SideBarModule} from '@ag-grid-enterprise/side-bar';
import {SparklinesModule} from '@ag-grid-enterprise/sparklines';
import {StatusBarModule} from '@ag-grid-enterprise/status-bar';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import classnames from 'classnames';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {Helmet} from 'react-helmet';
import {colNames, countries, COUNTRY_CODES, months} from './consts';
import {CountryFloatingFilterComponent} from './CountryFloatingFilterComponent';
import styles from './Dashboard.module.scss';
import {InstrumentFilter} from './InstrumentFilter';
import {InstrumentFloatingFilterComponent} from './InstrumentFloatingFilterComponent';
import {Toolbar} from './Toolbar.jsx';
import {
    axisLabelFormatter,
    booleanCleaner,
    createDataSizeValue,
    currencyFormatter,
    formatThousands,
    numberParser,
    sharedNumberParser,
    suppressColumnMoveAnimation,
} from './utils';
import {WinningsFilter} from './WinningsFilter';
import {useApiCalls} from "../api/API";
import TVChartContainer from "../chart/TVChartContainer";
import Resizable from "./Resizable";
import {LicenseManager} from "@ag-grid-enterprise/core";
// import {getDayDetails, getInstruments} from "../api/API";

const IS_SSR = typeof window === 'undefined';

const helmet = [];

const AgGridReactMemo = memo(AgGridReact);

const groupColumn = {
    headerName: 'Group',
    width: 250,
    field: 'name',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
        checkbox: true,
    },
};

function currencyCssFunc(params) {
    if (params.value !== null && params.value !== undefined && params.value < 0) {
        return { color: 'red', 'font-weight': 'bold' };
    }
    return {};
}

export class CountryCellRendererJs {
    eGui;

    init(params) {
        this.eGui = document.createElement('span');
        this.eGui.style.cursor = 'default';

        if (params.value === undefined) {
            return null;
        } else if (params.value == null || params.value === '' || params.value === '(Select All)') {
            this.eGui.innerHTML = params.value;
        } else {
            // Get flags from here: http://www.freeflagicons.com/
            // var flag = `<img border="0" width="15" height="10" alt="${
            //     params.value
            // } flag"  src="https://flags.fmcdn.net/data/flags/mini/${COUNTRY_CODES[params.value]}.png">`;
            this.eGui.innerHTML = params.value;
        }
    }

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false;
    }
}

function ratingFilterRenderer(params) {
    const { value } = params;
    if (value === '(Select All)') {
        return value;
    }

    return (
        <span>
            {[...Array(5)].map((x, i) => {
                return value > i ? (
                    <img key={i} src="/images/star.svg" alt={`${value} stars`} width="12" height="12" />
                ) : null;
            })}
            (No stars)
        </span>
    );
}

function ratingRenderer(params) {
    const { value } = params;
    if (value === '(Select All)') {
        return value;
    }

    return (
        <span>
            {[...Array(5)].map((x, i) => {
                return value > i ? (
                    <img key={i} src="/images/star.svg" alt={`${value} stars`} width="12" height="12" />
                ) : null;
            })}
        </span>
    );
}

function btoFilterRenderer(params) {
    const { value } = params;
    if (value === '(Select All)') {
        return value;
    }

    return (
        <span>
            {[...Array(3)].map((x, i) => {
                return value > i ? (
                    // <img key={i} src="/images/hot_pepper.svg" alt={`${value} chillis`} width="12" height="12" />
                    <img key={i} src="/images/Hot_pepper.png" alt="🌶️" width="15" height="15" />
                ) : null;
            })}
            (No stars)
        </span>
    );
}

function btoRenderer(params) {
    const { value } = params;
    if (value === '(Select All)') {
        return value;
    }

    return (
        <span>
            {[...Array(3)].map((x, i) => {
                return value > i ? (

                    // <img key={i} src="/images/hot_pepper.svg" alt={`${value} chillis`} width="12" height="12" />
                    <img key={i} src="/images/Hot_pepper.png" alt="🌶️" width="15" height="15" />
                ) : null;
            })}
        </span>
    );
}

function trendRenderer(params) {
    const { value } = params;
    if (value === 'UP') {
        return (
            <span>
                    <img src="/images/arrow_up.png" alt="UP" width="24" height="24" />
            </span>
        )
    } else if (value === 'DOWN') {
        return (
            <span>
                <img src="/images/arrow_down.png" alt="UP" width="24" height="24" />
            </span>
        )
    } else return null;
}


const booleanCellRenderer = (props) => {
    const valueCleaned = booleanCleaner(props.value);
    if (valueCleaned === true) {
        return <span title="true" className="ag-icon ag-icon-tick content-icon" />;
    }

    if (valueCleaned === false) {
        return <span title="false" className="ag-icon ag-icon-cross content-icon" />;
    }

    if (props.value !== null && props.value !== undefined) {
        return props.value.toString();
    }
    return null;
};

const booleanFilterCellRenderer = (props) => {
    const [valueCleaned] = useState(booleanCleaner(props.value));
    if (valueCleaned === true) {
        return <span title="true" className="ag-icon ag-icon-tick content-icon" />;
    }

    if (valueCleaned === false) {
        return <span title="false" className="ag-icon ag-icon-cross content-icon" />;
    }

    if (props.value === '(Select All)') {
        return props.value;
    }
    return '(empty)';
};

function dateFormatter(params) {
    var dateAsString = params.data.date;
    // console.log(dateAsString, typeof dateAsString);
    var dateParts = dateAsString.split('/');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2]}`;
}

// DATE COMPARATOR FOR SORTING
function dateComparator(date1, date2) {
    var date1Number = _monthToNum(date1);
    var date2Number = _monthToNum(date2);

    if (date1Number === null && date2Number === null) {
        return 0;
    }
    if (date1Number === null) {
        return -1;
    }
    if (date2Number === null) {
        return 1;
    }

    return date1Number - date2Number;
}

// HELPER FOR DATE COMPARISON
function _monthToNum(date) {
    if (date === undefined || date === null || date.length !== 10) {
        return null;
    }

    var yearNumber = date.substring(6, 10);
    var monthNumber = date.substring(3, 5);
    var dayNumber = date.substring(0, 2);

    var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
    // 29/08/2004 => 20040829
    return result;
}

class CustomTooltip {
    init(params) {
        const eGui = (this.eGui = document.createElement('div'));
        const color = params.color || 'black';
        const backgroundColor = params.backgroundColor || 'white';
        const data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
        let dateValue = null;
        if(params.cellName === 'predicted_high') {
            dateValue = data.high_touched_at;
        } else if(params.cellName === 'predicted_low') {
            dateValue = data.low_touched_at;
        } else if(params.cellName === 'entry_price') {
            dateValue = data.trade_entry_at;
        } else if(params.cellName === 'take_profit') {
            if(data.status === 'COMPLETED') {
                dateValue = data.trade_exit_at;
            }
        } else if(params.cellName === 'stop_loss') {
            if(data.status === 'STOPPED') {
                dateValue = data.trade_exit_at;
            }
        } else if(params.cellName === 'status') {
            if(data.status === 'IN-PLAY') {
                dateValue = data.trade_entry_at;
            } else if(data.status === 'COMPLETED') {
                dateValue = data.trade_exit_at;
            } else if(data.status === 'STOPPED') {
                dateValue = data.trade_exit_at;
            }
        }

        eGui.classList.add('custom-tooltip');
        //@ts-ignore
        eGui.style['background-color'] = backgroundColor;
        eGui.style['color'] = color;
        if (dateValue !== null) {
            dateValue = this.formatDate(dateValue);
        }
        let content = '';
        if (dateValue !== null) {
            content = `<p><span>Fill Time: ${dateValue}</span></p>`;
        }

        if (content) {
            eGui.innerHTML = content;
        }
    }

    formatDate(date) {
        // const dd = String(date.getDate()).padStart(2, '0');
        // const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        // const ms = String(date.getMilliseconds()).padStart(3, '0');
        return `${hh}:${min}:${sec}`;
    }

    getGui() {
        return this.eGui;
    }
}

const mobileDefaultCols = [
    {
        headerName: 'Name',
        rowDrag: true,
        field: 'name',
        width: 200,
        editable: true,
        cellClass: 'vAlign',
        checkboxSelection: (params) => {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        headerCheckboxSelection: (params) => {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        headerCheckboxSelectionFilteredOnly: true,
    },
    {
        headerName: 'Language',
        field: 'language',
        width: 150,
        editable: true,
        filter: 'agSetColumnFilter',
        cellEditor: 'agSelectCellEditor',
        cellClass: 'vAlign',
        cellEditorParams: {
            values: [
                'English',
                'Spanish',
                'French',
                'Portuguese',
                'German',
                'Swedish',
                'Norwegian',
                'Italian',
                'Greek',
                'Icelandic',
                'Portuguese',
                'Maltese',
            ],
        },
    },
    {
        headerName: 'Country',
        field: 'country',
        width: 150,
        editable: true,
        cellRenderer: 'countryCellRenderer',
        cellClass: 'vAlign',
        cellEditorPopup: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
            cellRenderer: 'countryCellRenderer',
            values: [
                'Argentina',
                'Brazil',
                'Colombia',
                'France',
                'Germany',
                'Greece',
                'Iceland',
                'Ireland',
                'Italy',
                'Malta',
                'Portugal',
                'Norway',
                'Peru',
                'Spain',
                'Sweden',
                'United Kingdom',
                'Uruguay',
                'Venezuela',
                'Belgium',
                'Luxembourg',
            ],
        },
        // floatCell: true,
        icons: {
            sortAscending: '<i class="fa fa-sort-alpha-up"/>',
            sortDescending: '<i class="fa fa-sort-alpha-down"/>',
        },
    },
    {
        headerName: 'Game Name',
        field: 'game.name',
        width: 180,
        editable: true,
        filter: 'agSetColumnFilter',
        cellClass: () => 'alphabet',
    },
    {
        headerName: 'Bank Balance',
        field: 'bankBalance',
        width: 180,
        editable: true,
        valueFormatter: currencyFormatter,
        type: 'numericColumn',
        cellClassRules: {
            currencyCell: 'typeof x == "number"',
        },
        enableValue: true,
    },
    {
        headerName: 'Total Winnings',
        field: 'totalWinnings',
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        editable: true,
        valueParser: numberParser,
        width: 170,
        // aggFunc: 'sum',
        enableValue: true,
        cellClassRules: {
            currencyCell: 'typeof x == "number"',
        },
        valueFormatter: currencyFormatter,
        cellStyle: currencyCssFunc,
        icons: {
            sortAscending: '<i class="fa fa-sort-amount-up"/>',
            sortDescending: '<i class="fa fa-sort-amount-down"/>',
        },
    },
];

const desktopDefaultCols = [
    // {
    //     headerName: 'Test Date',
    //     editable: true,
    //     cellEditor: 'date',
    //     field: 'testDate'
    // },
    //{headerName: "", valueGetter: "node.id", width: 20}, // this row is for showing node id, handy for testing
    {
        headerName: 'Session Date',
        field: 'date',
        valueFormatter: dateFormatter,
        comparator: dateComparator,
        filter: 'agDateColumnFilter',
        floatingFilter: true,
        rowDrag: true,
        checkboxSelection: (params) => {
            // we put checkbox on the name if we are not doing grouping
            // console.log("selected date: " + params);
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        floatingFilterComponentParams: {
            suppressFilterButton: true,
        },
        filterParams: {
            debounceMs: 500,
            suppressAndOrCondition: true,
            comparator: function(filterLocalDateAtMidnight, cellValue) {
                if (cellValue == null) {
                    return 0;
                }
                var dateParts = cellValue.split('/');
                var year = Number(dateParts[2]);
                var month = Number(dateParts[1]) - 1;
                var day = Number(dateParts[0]);
                var cellDate = new Date(year, month, day);

                if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                } else if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                } else {
                    return 0;
                }
            },
        },
    },
    {
        // column group 'Markets
        headerName: 'Markets',
        // marryChildren: true,
        children: [
            {
                headerName: 'Instrument',
                field: 'name',
                width: 150,
                editable: false, //edit should not be allowed
                enableRowGroup: true,
                floatingFilter: false,
                // enablePivot: true,
                filter: 'instrumentFilter',
                floatingFilterComponent: 'instrumentFloatingFilterComponent',
                cellClass: 'vAlign',
                // headerCheckboxSelection: (params) => {
                //     // we put checkbox on the name if we are not doing grouping
                //     return params.columnApi.getRowGroupColumns().length === 0;
                // },
                headerCheckboxSelectionFilteredOnly: true,
            },
            // {
            //     headerName: 'LTP',
            //     field: 'ltp',
            //     width: 100,
            //     editable: false,
            //     // cellEditor: 'agSelectCellEditor',
            //     cellClass: 'vAlign',
            //     // cellClassRules: {
            //     //     'ltp-increased': (params) => params.data.ltpChange === 'increased',
            //     //     'ltp-decreased': (params) => params.data.ltpChange === 'decreased',
            //     //     'ltp-unchanged': (params) => params.data.ltpChange === 'unchanged',
            //     // },
            //     cellStyle: (params) => {
            //         if (params.data.ltpChange === 'increased') return { backgroundColor: 'green' };
            //         else if (params.data.ltpChange === 'decreased') return { backgroundColor: 'red' };
            //         else if (params.data.ltpChange === 'unchanged') return { backgroundColor: 'yellow' }; // unchanged
            //         else if(params.data.ltpChange === 'frozen') return { backgroundColor: 'grey' };
            //         // return { backgroundColor: 'yellow' }; // unchanged
            //     },
            //     // wrapText: true,
            //     // autoHeight: true,
            //     enableRowGroup: true,
            //     enablePivot: true,
            //     // rowGroupIndex: 0,
            //     // pivotIndex: 0,
            //     // pinned: 'left',
            //     // headerTooltip: 'Dashboard tooltip for Language',
            //     filter: 'agMultiColumnFilter',
            //     filterParams: {
            //         filters: [
            //             {
            //                 filter: 'agTextColumnFilter',
            //                 display: 'subMenu',
            //             },
            //             {
            //                 filter: 'agSetColumnFilter',
            //                 filterParams: {
            //                     buttons: ['reset'],
            //                 },
            //             },
            //         ],
            //     },
            // },
            {
                headerName: 'Symbol', //was country
                field: 'symbol',
                width: 120,
                editable: false,
                cellRenderer: 'countryCellRenderer',
                cellEditorPopup: true,
                suppressFillHandle: true,
                // pivotIndex: 1,
                // rowGroupIndex: 1,
                cellClass: ['countryCell', 'vAlign'],
                // colSpan: function(params) {
                //     if (params.data && params.data.country==='Ireland') {
                //         return 2;
                //     } else if (params.data && params.data.country==='France') {
                //         return 3;
                //     } else {
                //         return 1;
                //     }
                // },
                // cellStyle: function(params) {
                //     if (params.data && params.data.country==='Ireland') {
                //         return {backgroundColor: 'red'};
                //     } else if (params.data && params.data.country==='France') {
                //         return {backgroundColor: 'green'};
                //     } else {
                //         return null;
                //     }
                // },
                // rowSpan: function(params) {
                //     if (params.data && params.data.country==='Ireland') {
                //         return 2;
                //     } else if (params.data && params.data.country==='France') {
                //         return 3;
                //     } else {
                //         return 1;
                //     }
                // },
                // suppressMovable: true,
                enableRowGroup: true,
                enablePivot: true,
                cellEditor: 'agRichSelectCellEditor',
                hide: true,
                // cellEditorParams: {
                //     cellRenderer: 'countryCellRenderer',
                //     values: [
                //         'Argentina',
                //         'Brazil',
                //         'Colombia',
                //         'France',
                //         'Germany',
                //         'Greece',
                //         'Iceland',
                //         'Ireland',
                //         'Italy',
                //         'Malta',
                //         'Portugal',
                //         'Norway',
                //         'Peru',
                //         'Spain',
                //         'Sweden',
                //         'United Kingdom',
                //         'Uruguay',
                //         'Venezuela',
                //         'Belgium',
                //         'Luxembourg',
                //     ],
                // },
                // pinned: 'left',
                // floatCell: true,
                filter: 'agSetColumnFilter',
                filterParams: {
                    cellRenderer: 'countryCellRenderer',
                    // cellHeight: 20,
                    buttons: ['reset'],
                    // suppressSelectAll: true
                },
                // floatingFilterComponent: 'countryFloatingFilterComponent',
                icons: {
                    sortAscending: '<i class="fa fa-sort-alpha-up"/>',
                    sortDescending: '<i class="fa fa-sort-alpha-down"/>',
                },
            },
            {
                // TODO: add hot paper
                headerName: 'BTO', //new
                field: 'bto',
                width: 80,
                editable: false,
                cellRenderer: 'btoRenderer',
                cellClass: 'vAlign',
                floatCell: true,
                suppressSpanHeaderHeight: true,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                chartDataType: 'category',
                filterParams: { cellRenderer: 'btoFilterRenderer' },

            },
            {
                headerName: 'Security Type', //new
                field: 'securityType',
                width: 100,
                editable: false,
                cellRenderer: 'countryCellRenderer',
                cellEditorPopup: true,
                hide: true,
                suppressFillHandle: true,
                cellClass: ['countryCell', 'vAlign'],
                enableRowGroup: true,
                enablePivot: true,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    cellRenderer: 'countryCellRenderer',
                    values: [
                        'Energy',
                    ],
                },
                filter: 'agSetColumnFilter',
                filterParams: {
                    cellRenderer: 'countryCellRenderer',
                    // cellHeight: 20,
                    buttons: ['reset'],
                    // suppressSelectAll: true
                },
                // floatingFilterComponent: 'countryFloatingFilterComponent',
                icons: {
                    sortAscending: '<i class="fa fa-sort-alpha-up"/>',
                    sortDescending: '<i class="fa fa-sort-alpha-down"/>',
                },
            },
        ],
    },
    {
        // column group 'Game of Choice'
        headerName: 'Predictions',
        groupId: 'prediction',
        children: [
            {
                headerName: 'P. High',
                field: 'price_high',
                width: 100,
                floatingFilter: false,
                editable: false,
                filter: 'agMultiColumnFilter',
                tooltipField: 'price_high',
                tooltipComponentParams: { backgroundColor: '#2a2a2a', color: '#e0e0e0', cellName: 'predicted_high' },
                cellStyle: (params) => {
                    if(params.data.high_touched_at) {
                        return { backgroundColor: '#008000' };
                    }
                },
                // wrapText: true,
                // autoHeight: true,
                cellClass: () => 'alphabet',
                filterParams: {
                    filters: [
                        {
                            filter: 'agTextColumnFilter',
                            display: 'subMenu',
                        },
                        {
                            filter: 'agSetColumnFilter',
                            filterParams: {
                                buttons: ['reset'],
                            },
                        },
                    ],
                },
                enableRowGroup: true,
                enablePivot: true,
                // pinned: 'right',
                // rowGroupIndex: 1,
                icons: {
                    sortAscending: '<i class="fa fa-sort-alpha-up"/>',
                    sortDescending: '<i class="fa fa-sort-alpha-down"/>',
                },
            },
            {
                headerName: 'P. Trend',
                field: 'price_trend',
                columnGroupShow: 'open',
                filter: 'agSetColumnFilter',
                editable: false,
                width: 110,
                // pinned: 'right',
                // rowGroupIndex: 2,
                // pivotIndex: 1,
                enableRowGroup: true,
                enablePivot: true,
                // cellClass: 'booleanType',
                cellClass: () => 'alphabet',
                // cellRenderer: 'booleanCellRenderer',
                cellRenderer: 'trendRenderer',
                cellStyle: { textAlign: 'center' },
                // comparator: booleanComparator,
                // floatCell: true,
                filterParams: {
                    // cellRenderer: 'booleanFilterCellRenderer',
                    cellRenderer: 'countryCellRenderer',
                    buttons: ['reset'],
                },
            },
            {
                headerName: 'P. Low',
                field: 'price_low',
                columnGroupShow: 'open',
                floatingFilter: false,
                width: 100,
                editable: false,
                filter: 'agMultiColumnFilter',
                tooltipField: 'price_low',
                tooltipComponentParams: { backgroundColor: '#2a2a2a', color: '#e0e0e0', cellName: 'predicted_low' },
                cellStyle: (params) => {
                    if(params.data.low_touched_at) {
                        return { backgroundColor: '#008000' };
                    }
                },
                // wrapText: true,
                // autoHeight: true,
                cellClass: () => 'alphabet',
                filterParams: {
                    filters: [
                        {
                            filter: 'agTextColumnFilter',
                            display: 'subMenu',
                        },
                        {
                            filter: 'agSetColumnFilter',
                            filterParams: {
                                buttons: ['reset'],
                            },
                        },
                    ],
                },
                enableRowGroup: true,
                enablePivot: true,
                // pinned: 'right',
                // rowGroupIndex: 1,
                icons: {
                    sortAscending: '<i class="fa fa-sort-alpha-up"/>',
                    sortDescending: '<i class="fa fa-sort-alpha-down"/>',
                },

            },
            // {
            //     headerName: 'Rating',
            //     field: 'rating',
            //     width: 150,
            //     editable: true,
            //     cellRenderer: 'ratingRenderer',
            //     cellClass: 'vAlign',
            //     // floatCell: true,
            //     // suppressSpanHeaderHeight: true,
            //     enableRowGroup: true,
            //     enablePivot: true,
            //     enableValue: true,
            //     chartDataType: 'category',
            //     filterParams: { cellRenderer: 'ratingFilterRenderer' },
            // }
        ],
    },
    {
        headerName: 'Tradebook',
        groupId: 'tradebook',
        children: [
            {
                headerName: 'Buy / Sell',
                // rowDrag: true,
                field: 'action',
                width: 120,
                editable: false, //edit should not be allowed
                enableRowGroup: true,
                // enablePivot: true,
                filter: 'instrumentFilter',
                cellClass: 'vAlign',
                floatingFilterComponent: 'instrumentFloatingFilterComponent',
                // checkboxSelection: (params) => {
                //     // we put checkbox on the name if we are not doing grouping
                //     return params.columnApi.getRowGroupColumns().length === 0;
                // },
                // headerCheckboxSelection: (params) => {
                //     // we put checkbox on the name if we are not doing grouping
                //     return params.columnApi.getRowGroupColumns().length === 0;
                // },
                headerCheckboxSelectionFilteredOnly: true,
            },
            {
                headerName: 'Entry Price',
                field: 'entry_price',
                columnGroupShow: 'open',
                width: 120,
                editable: false,
                floatingFilter: false,
                cellEditor: 'agSelectCellEditor',
                cellClass: 'vAlign',
                tooltipField: 'entry_price',
                tooltipComponentParams: { backgroundColor: '#2a2a2a', color: '#e0e0e0', cellName: 'entry_price' },

                // wrapText: true,
                // autoHeight: true,
                enableRowGroup: true,
                enablePivot: true,
                // rowGroupIndex: 0,
                // pivotIndex: 0,
                // pinned: 'left',
                // headerTooltip: 'Dashboard tooltip for Language',
                filter: 'agMultiColumnFilter',
                filterParams: {
                    filters: [
                        {
                            filter: 'agTextColumnFilter',
                            display: 'subMenu',
                        },
                        {
                            filter: 'agSetColumnFilter',
                            filterParams: {
                                buttons: ['reset'],
                            },
                        },
                    ],
                },
            },
            {
                headerName: 'Take Profit',
                field: 'take_profit',
                columnGroupShow: 'open',
                width: 120,
                editable: false,
                cellEditor: 'agSelectCellEditor',
                cellClass: 'vAlign',
                floatingFilter: false,
                tooltipField: 'take_profit',
                tooltipComponentParams: { backgroundColor: '#2a2a2a', color: '#e0e0e0', cellName: 'take_profit' },
                // wrapText: true,
                // autoHeight: true,
                enableRowGroup: true,
                enablePivot: true,
                // rowGroupIndex: 0,
                // pivotIndex: 0,
                // pinned: 'left',
                // headerTooltip: 'Dashboard tooltip for Language',
                filter: 'agMultiColumnFilter',
                filterParams: {
                    filters: [
                        {
                            filter: 'agTextColumnFilter',
                            display: 'subMenu',
                        },
                        {
                            filter: 'agSetColumnFilter',
                            filterParams: {
                                buttons: ['reset'],
                            },
                        },
                    ],
                },
            },
            {
                headerName: 'Stop Loss',
                field: 'stop_loss',
                columnGroupShow: 'open',
                width: 120,
                editable: false,
                cellEditor: 'agSelectCellEditor',
                cellClass: 'vAlign',
                tooltipField: 'stop_loss',
                tooltipComponentParams: { backgroundColor: '#2a2a2a', color: '#e0e0e0', cellName: 'stop_loss' },
                // wrapText: true,
                // autoHeight: true,
                enableRowGroup: true,
                floatingFilter: false,

                enablePivot: true,
                // rowGroupIndex: 0,
                // pivotIndex: 0,
                // pinned: 'left',
                // headerTooltip: 'Dashboard tooltip for Language',
                filter: 'agMultiColumnFilter',
                filterParams: {
                    filters: [
                        {
                            filter: 'agTextColumnFilter',
                            display: 'subMenu',
                        },
                        {
                            filter: 'agSetColumnFilter',
                            filterParams: {
                                buttons: ['reset'],
                            },
                        },
                    ],
                },
            },
            {
                headerName: 'Status',
                field: 'status',
                columnGroupShow: 'open',
                filter: 'agSetColumnFilter',
                editable: false,
                width: 120,
                tooltipField: 'status',
                tooltipComponentParams: { backgroundColor: '#2a2a2a', color: '#e0e0e0', cellName: 'status' },
                // pinned: 'right',
                // rowGroupIndex: 2,
                // pivotIndex: 1,
                enableRowGroup: true,
                enablePivot: true,
                // cellClass: 'booleanType',
                cellClass: () => 'alphabet',
                // cellRenderer: 'booleanCellRenderer',
                cellRenderer: 'countryCellRenderer',
                // cellStyle: { textAlign: 'center' },
                cellStyle: (params) => {
                    let cellStyle = { textAlign: 'center' };
                    switch (params.value) {
                        case 'PENDING':
                            cellStyle.backgroundColor = '#A9A9A9'; // Gray
                            break;
                        case 'IN-PLAY':
                            cellStyle.backgroundColor = '#0000FF'; // Blue
                            break;
                        case 'STOPPED':
                            cellStyle.backgroundColor = '#FF0000'; // Red
                            break;
                        case 'COMPLETED':
                            cellStyle.backgroundColor = '#008000'; // Green
                            break;
                        case 'CLOSED':
                            cellStyle.backgroundColor = '#FFA500'; // Orange
                            break;
                        default:
                            break;
                    }
                    return cellStyle;
                },
                // comparator: booleanComparator,
                // floatCell: true,
                filterParams: {
                    // cellRenderer: 'booleanFilterCellRenderer',
                    cellRenderer: 'countryCellRenderer',
                    buttons: ['reset'],
                },
            },
        ]

    },
    {
        headerName: 'Session Time',
        field: 'session_time',
        floatingFilter: false,
        width: 110,
        hide: true,
    }

];

const Dashboard = () => {
    const gridRef = useRef(null);
    const loadInstance = useRef(0);
    const [gridTheme, setGridTheme] = useState(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const theme = params.get('theme') || 'ag-theme-balham-dark';
        setGridTheme(theme);
    }, []);
    const [base64Flags, setBase64Flags] = useState();
    const [defaultCols, setDefaultCols] = useState();
    const [isSmall, setIsSmall] = useState(false);
    const [defaultColCount, setDefaultColCount] = useState();
    const [columnDefs, setColumnDefs] = useState();
    const [rowData, setRowData] = useState();
    const [message, setMessage] = useState();
    const [showMessage, setShowMessage] = useState(false);
    const [rowCols, setRowCols] = useState([]);
    const [dataSize, setDataSize] = useState();
    const {getDayDetails} = useApiCalls();
    LicenseManager.setLicenseKey("Using_this_AG_Grid_Enterprise_key_( AG-044608 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com)___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( AZH )_is_granted_a_( Single Application )_Developer_License_for_the_application_( AZH )_only_for_( 1 )_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_( AZH )_need_to_be_licensed___( AZH )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 4 July 2024 )____[v2]_MTcyMDA0NzYwMDAwMA==aa96bf6a52d48878edcfdcef745c0e32")

    const modules = useMemo(
        () => [
            ClientSideRowModelModule,
            CsvExportModule,
            ClipboardModule,
            ColumnsToolPanelModule,
            ExcelExportModule,
            FiltersToolPanelModule,
            GridChartsModule,
            MasterDetailModule,
            MenuModule,
            MultiFilterModule,
            RangeSelectionModule,
            RichSelectModule,
            RowGroupingModule,
            SetFilterModule,
            SideBarModule,
            StatusBarModule,
            SparklinesModule,
        ],
        []
    );

    const defaultExportParams = useMemo(
        () => ({
            headerRowHeight: 40,
            rowHeight: 30,
            fontSize: 14,
            addImageToCell: (rowIndex, column, value) => {
                if (column.colId === 'country') {
                    return {
                        image: {
                            id: value,
                            base64: base64Flags[COUNTRY_CODES[value]],
                            imageType: 'png',
                            width: 20,
                            height: 12,
                            position: {
                                offsetX: 17,
                                offsetY: 14,
                            },
                        },
                        value: value,
                    };
                }
            },
        }),
        [base64Flags]
    );

    const selectionChanged = (event) => {
        // console.log('Callback selectionChanged: selection count = ' + gridOptions.api.getSelectedNodes().length);
    };

    const rowSelected = (event) => {
        // the number of rows selected could be huge, if the user is grouping and selects a group, so
        // to stop the console from clogging up, we only print if in the first 10 (by chance we know
        // the node id's are assigned from 0 upwards)
        if (event.node.id < 10) {
            const valueToPrint = event.node.group ? `group (${event.node.key})` : event.node.data.name;
            console.log('Callback rowSelected: ' + valueToPrint + ' - ' + event.node.isSelected());
        }
    };

    const getContextMenuItems = (params) => {
        const result = params.defaultItems ? params.defaultItems.splice(0) : [];
        result.push({
            name: 'Custom Menu Item',
            icon: `<img src="../images/lab.svg" style="width: 14px; height: 14px;"/>`,
            //shortcut: 'Alt + M',
            action: () => {
                const message = `You clicked a custom menu item on cell ${params.value ? params.value : '<empty>'}`;
                IS_SSR ? console.log(message) : window.alert(message);
            },
        });

        return result;
    };

    const gridOptions = useMemo(
        () => ({
            // suppressCellFlash: true,
            statusBar: {
                statusPanels: [
                    { statusPanel: 'agTotalAndFilteredRowCountComponent', key: 'totalAndFilter', align: 'left' },
                    { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
                    { statusPanel: 'agAggregationComponent', align: 'right' },
                ],
            },
            // suppressAnimationFrame: true,
            components: {
                instrumentFilter: InstrumentFilter,
                instrumentFloatingFilterComponent: InstrumentFloatingFilterComponent,
                countryCellRenderer: CountryCellRendererJs,
                countryFloatingFilterComponent: CountryFloatingFilterComponent,
                booleanCellRenderer: booleanCellRenderer,
                booleanFilterCellRenderer: booleanFilterCellRenderer,
                winningsFilter: WinningsFilter,
                btoRenderer: btoRenderer,
                btoFilterRenderer: btoFilterRenderer,
                trendRenderer: trendRenderer
            },
            defaultColDef: {
                minWidth: 50,
                sortable: true,
                filter: true,
                floatingFilter: !isSmall,
                resizable: true,
                cellDataType: false,
                tooltipComponent: CustomTooltip,
            },
            enableCellChangeFlash: false,
            rowDragManaged: true,
            // suppressMoveWhenRowDragging: true,
            rowDragMultiRow: true,
            popupParent: IS_SSR ? null : document.querySelector('#example-wrapper'),
            // enableBrowserTooltips: true,
            tooltipShowDelay: 50,
            tooltipHideDelay: 10000,
            // ensureDomOrder: true,
            // enableCellTextSelection: true,
            // postProcessPopup: function(params) {
            //     console.log(params);
            // },
            // need to be careful here inside the normal demo, as names are not unique if big data sets
            // getRowId: function(params) {
            //     return params.data.name;
            // },
            // suppressAsyncEvents: true,
            // suppressAggAtRootLevel: true,
            // suppressAggFilteredOnly: true,
            // suppressScrollWhenPopupsAreOpen: true,
            // debug: true,
            // editType: 'fullRow',
            // debug: true,
            // suppressMultiRangeSelection: true,
            rowGroupPanelShow: isSmall ? undefined : 'always', // on of ['always','onlyWhenGrouping']
            suppressMenuHide: isSmall,
            pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
            // suppressExpandablePivotGroups: true,
            // pivotColumnGroupTotals: 'before',
            // pivotRowTotals: 'before',
            suppressRowTransform: true,
            // rowBuffer: 10,
            // columnDefs: [],
            // singleClickEdit: true,
            // suppressClickEdit: true,
            // suppressClipboardApi: true,
            enterNavigatesVerticallyAfterEdit: true,
            enterNavigatesVertically: true,
            // domLayout: 'autoHeight',
            // domLayout: 'forPrint',
            // groupDisplayType = 'groupRows'
            // groupDefaultExpanded: 9999, //one of [true, false], or an integer if greater than 1
            // headerHeight: 100, // set to an integer, default is 25, or 50 if grouping columns
            // groupDisplayType = 'custom'
            // pivotSuppressAutoColumn: true,
            // groupSuppressBlankHeader: true,
            // suppressMovingCss: true,
            // suppressMovableColumns: true,
            // groupIncludeFooter: true,
            // groupIncludeTotalFooter: true,
            // suppressHorizontalScroll: true,
            // alwaysShowHorizontalScroll: true,
            // alwaysShowVerticalScroll: true,
            // debounceVerticalScrollbar: true,
            suppressColumnMoveAnimation: suppressColumnMoveAnimation(),
            // suppressRowHoverHighlight: true,
            // suppressTouch: true,
            // suppressDragLeaveHidesColumns: true,
            // suppressMakeColumnVisibleAfterUnGroup: true,
            // unSortIcon: true,
            enableRtl: IS_SSR ? false : /[?&]rtl=true/.test(window.location.search),
            enableCharts: true,
            // multiSortKey: 'ctrl',
            animateRows: true,

            enableRangeSelection: true,
            // enableRangeHandle: true,
            enableFillHandle: true,
            undoRedoCellEditing: true,
            undoRedoCellEditingLimit: 50,

            suppressClearOnFillReduction: false,

            rowSelection: 'multiple', // one of ['single','multiple'], leave blank for no selection
            // suppressRowDeselection: true,
            quickFilterText: null,
            groupSelectsChildren: true, // one of [true, false]
            // groupAggFiltering: true,
            // pagination: true,
            // paginateChildRows: true,
            // paginationPageSize: 10,
            // groupSelectsFiltered: true,
            // suppressGroupRowsSticky: true,
            suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
            // suppressColumnVirtualisation: true,
            // suppressContextMenu: true,
            // preventDefaultOnContextMenu: true,
            // suppressFieldDotNotation: true,
            autoGroupColumnDef: groupColumn,
            // suppressActionCtrlC: true,
            // suppressActionCtrlV: true,
            // suppressActionCtrlD: true,
            // suppressActionCtrlA: true,
            // suppressCellFocus: true,
            // suppressMultiSort: true,
            // alwaysMultiSort: true,
            // scrollbarWidth: 20,
            sideBar: {
                toolPanels: [
                    {
                        id: 'columns',
                        labelDefault: 'Columns',
                        labelKey: 'columns',
                        iconKey: 'columns',
                        toolPanel: 'agColumnsToolPanel',
                        toolPanelParams: {
                            syncLayoutWithGrid: true,
                        },
                    },
                    {
                        id: 'filters',
                        labelDefault: 'Filters',
                        labelKey: 'filters',
                        iconKey: 'filter',
                        toolPanel: 'agFiltersToolPanel',
                        toolPanelParams: {
                            syncLayoutWithGrid: true,
                        },
                    },
                ],
                position: 'right',
                // defaultToolPanel: 'columns',
                hiddenByDefault: false,
            },

            // suppressBrowserResizeObserver: true,
            // showToolPanel: true,//window.innerWidth > 1000,
            // toolPanelSuppressColumnFilter: true,
            // toolPanelSuppressColumnSelectAll: true,
            // toolPanelSuppressColumnExpandAll: true,
            // autoSizePadding: 20,
            // toolPanelSuppressGroups: true,
            // toolPanelSuppressValues: true,
            // groupDisplayType = 'custom',
            // contractColumnSelection: true,
            // groupAggFields: ['bankBalance','totalWinnings'],
            // groupDisplayType = 'multipleColumns',
            // groupHideOpenParents: true,
            // suppressMenuFilterPanel: true,
            // clipboardDelimiter: ',',
            // suppressLastEmptyLineOnPaste: true,
            // suppressMenuMainPanel: true,
            // suppressMenuColumnPanel: true,
            // forPrint: true,
            // rowClass: function(params) { return (params.data.country === 'Ireland') ? "theClass" : null; },
            onRowSelected: rowSelected, //callback when row selected
            onSelectionChanged: selectionChanged, //callback when selection changed,
            aggFuncs: {
                zero: () => 0,
            },
            getBusinessKeyForNode: (node) => (node.data ? node.data.name : ''),
            initialGroupOrderComparator: ({ nodeA, nodeB }) => {
                if (nodeA.key < nodeB.key) {
                    return -1;
                }
                if (nodeA.key > nodeB.key) {
                    return 1;
                }

                return 0;
            },
            processCellFromClipboard: (params) => {
                const colIdUpperCase = params.column.getId().toUpperCase();
                const monthsUpperCase = months.map((month) => month.toUpperCase());
                const isMonth = monthsUpperCase.indexOf(colIdUpperCase) >= 0;

                if (isMonth) {
                    return sharedNumberParser(params.value);
                }

                return params.value;
            },
            // rowHeight: 100,
            // suppressTabbing: true,
            // columnHoverHighlight: true,
            // suppressAnimationFrame: true,
            // pinnedTopRowData: [
            //     {name: 'Mr Pinned Top 1', language: 'English', country: 'Ireland', continent:"Europe", game:{name:"Hare and Hounds",bought:"true"}, totalWinnings: 342424, bankBalance:75700.9,rating:2,jan:20478.54,feb:2253.06,mar:39308.65,apr:98710.13,may:96186.55,jun:91925.91,jul:1149.47,aug:32493.69,sep:19279.44,oct:21624.14,nov:71239.81,dec:80031.35},
            //     {name: 'Mr Pinned Top 2', language: 'English', country: 'Ireland', continent:"Europe", game:{name:"Hare and Hounds",bought:"true"}, totalWinnings: 342424, bankBalance:75700.9,rating:2,jan:20478.54,feb:2253.06,mar:39308.65,apr:98710.13,may:96186.55,jun:91925.91,jul:1149.47,aug:32493.69,sep:19279.44,oct:21624.14,nov:71239.81,dec:80031.35},
            //     {name: 'Mr Pinned Top 3', language: 'English', country: 'Ireland', continent:"Europe", game:{name:"Hare and Hounds",bought:"true"}, totalWinnings: 342424, bankBalance:75700.9,rating:2,jan:20478.54,feb:2253.06,mar:39308.65,apr:98710.13,may:96186.55,jun:91925.91,jul:1149.47,aug:32493.69,sep:19279.44,oct:21624.14,nov:71239.81,dec:80031.35},
            // ],
            // pinnedBottomRowData: [
            //     {name: 'Mr Pinned Bottom 1', language: 'English', country: 'Ireland', continent:"Europe", game:{name:"Hare and Hounds",bought:"true"}, totalWinnings: 342424, bankBalance:75700.9,rating:2,jan:20478.54,feb:2253.06,mar:39308.65,apr:98710.13,may:96186.55,jun:91925.91,jul:1149.47,aug:32493.69,sep:19279.44,oct:21624.14,nov:71239.81,dec:80031.35},
            //     {name: 'Mr Pinned Bottom 2', language: 'English', country: 'Ireland', continent:"Europe", game:{name:"Hare and Hounds",bought:"true"}, totalWinnings: 342424, bankBalance:75700.9,rating:2,jan:20478.54,feb:2253.06,mar:39308.65,apr:98710.13,may:96186.55,jun:91925.91,jul:1149.47,aug:32493.69,sep:19279.44,oct:21624.14,nov:71239.81,dec:80031.35},
            //     {name: 'Mr Pinned Bottom 3', language: 'English', country: 'Ireland', continent:"Europe", game:{name:"Hare and Hounds",bought:"true"}, totalWinnings: 342424, bankBalance:75700.9,rating:2,jan:20478.54,feb:2253.06,mar:39308.65,apr:98710.13,may:96186.55,jun:91925.91,jul:1149.47,aug:32493.69,sep:19279.44,oct:21624.14,nov:71239.81,dec:80031.35},
            // ],
            // callback when row clicked
            // stopEditingWhenCellsLoseFocus: true,
            // allowShowChangeAfterFilter: true,
            processPivotResultColDef: (def) => {
                def.filter = 'agNumberColumnFilter';
                def.floatingFilter = true;
            },
            onRowClicked: (params) => {
                // console.log("Callback onRowClicked: " + (params.data?params.data.name:null) + " - " + params.event);
            },
            // onSortChanged: function (params) {
            //     console.log("Callback onSortChanged");
            // },
            onRowDoubleClicked: (params) => {
                // console.log("Callback onRowDoubleClicked: " + params.data.name + " - " + params.event);
            },
            onGridSizeChanged: (params) => {
                // console.log("Callback onGridSizeChanged: ", params);
            },
            // callback when cell clicked
            onCellClicked: (params) => {
                // console.log("Callback onCellClicked: " + params.value + " - " + params.colDef.field + ' - ' + params.event);
            },
            onColumnVisible: (event) => {
                // console.log("Callback onColumnVisible:", event);
            },
            onColumnResized: (event) => {
                // leave this out, as it slows things down when resizing
                // console.log("Callback onColumnResized:", event);
            },
            onCellValueChanged: (params) => {
                // taking this out, as clipboard paste operation can result in this getting called
                // lots and lots of times (especially if user does ctrl+a to copy everything, then paste)
                // console.log("Callback onCellValueChanged:", params);
            },
            onRowDataChanged: (params) => {
                // console.log('Callback onRowDataChanged: ');
            },
            // callback when cell double clicked
            onCellDoubleClicked: (params) => {
                // console.log("Callback onCellDoubleClicked: " + params.value + " - " + params.colDef.field + ' - ' + params.event);
            },
            // callback when cell right clicked
            onCellContextMenu: (params) => {
                // console.log("Callback onCellContextMenu: " + params.value + " - " + params.colDef.field + ' - ' + params.event);
            },
            onCellFocused: (params) => {
                // console.log('Callback onCellFocused: ' + params.rowIndex + " - " + params.colIndex);
            },
            onPasteStart: (params) => {
                // console.log('Callback onPasteStart:', params);
            },
            onPasteEnd: (params) => {
                // console.log('Callback onPasteEnd:', params);
            },
            onGridReady: (event) => {
                // console.log('Callback onGridReady: api = ' + event.api);

                if (!IS_SSR && document.documentElement.clientWidth <= 1024) {
                    event.api.closeToolPanel();
                }
            },
            onRowGroupOpened: (event) => {
                // console.log('Callback onRowGroupOpened: node = ' + event.node.key + ', ' + event.expanded);
            },
            onRangeSelectionChanged: (event) => {
                // console.log('Callback onRangeSelectionChanged: finished = ' + event.finished);
            },
            chartThemeOverrides: {
                polar: {
                    series: {
                        pie: {
                            calloutLabel: {
                                enabled: false,
                            },
                            tooltip: {
                                renderer: (params) => ({
                                    content: '$' + formatThousands(Math.round(params.datum[params.angleKey])),
                                }),
                            },
                        },
                    },
                },
                cartesian: {
                    axes: {
                        number: {
                            label: {
                                formatter: axisLabelFormatter,
                            },
                        },
                    },
                    series: {
                        column: {
                            tooltip: {
                                renderer: (params) => ({
                                    content: '$' + formatThousands(Math.round(params.datum[params.yKey])),
                                }),
                            },
                        },
                        bar: {
                            tooltip: {
                                renderer: (params) => ({
                                    content: '$' + formatThousands(Math.round(params.datum[params.yKey])),
                                }),
                            },
                        },
                        line: {
                            tooltip: {
                                renderer: (params) => ({
                                    content: '$' + formatThousands(Math.round(params.datum[params.yKey])),
                                }),
                            },
                        },
                        area: {
                            tooltip: {
                                renderer: (params) => ({
                                    content: '$' + formatThousands(Math.round(params.datum[params.yKey])),
                                }),
                            },
                        },
                        scatter: {
                            tooltip: {
                                renderer: (params) => {
                                    const label = params.labelKey ? params.datum[params.labelKey] + '<br>' : '';
                                    const xValue = params.xName + ': $' + formatThousands(params.datum[params.xKey]);
                                    const yValue = params.yName + ': $' + formatThousands(params.datum[params.yKey]);
                                    let size = '';
                                    if (params.sizeKey) {
                                        size =
                                            '<br>' +
                                            params.sizeName +
                                            ': $' +
                                            formatThousands(params.datum[params.sizeKey]);
                                    }
                                    return {
                                        content: label + xValue + '<br>' + yValue + size,
                                    };
                                },
                            },
                        },
                        histogram: {
                            tooltip: {
                                renderer: (params) => ({
                                    title:
                                        (params.xName || params.xKey) +
                                        ': $' +
                                        formatThousands(params.datum.domain[0]) +
                                        ' - $' +
                                        formatThousands(params.datum.domain[1]),
                                    // With a yKey, the value is the total of the yKey value for the population of the bin.
                                    // Without a yKey, the value is a count of the population of the bin.
                                    content: params.yKey
                                        ? formatThousands(Math.round(params.datum.total))
                                        : params.datum.frequency,
                                }),
                            },
                        },
                    },
                },
            },
            getContextMenuItems: getContextMenuItems,
            excelStyles: [
                {
                    id: 'vAlign',
                    alignment: {
                        vertical: 'Center',
                    },
                },
                {
                    id: 'alphabet',
                    alignment: {
                        vertical: 'Center',
                    },
                },
                {
                    id: 'good-score',
                    alignment: {
                        horizontal: 'Center',
                        vertical: 'Center',
                    },
                    interior: {
                        color: '#C6EFCE',
                        pattern: 'Solid',
                    },
                    numberFormat: {
                        format: '[$$-409]#,##0',
                    },
                },
                {
                    id: 'bad-score',
                    alignment: {
                        horizontal: 'Center',
                        vertical: 'Center',
                    },
                    interior: {
                        color: '#FFC7CE',
                        pattern: 'Solid',
                    },
                    numberFormat: {
                        format: '[$$-409]#,##0',
                    },
                },
                {
                    id: 'header',
                    font: {
                        color: '#44546A',
                        size: 16,
                    },
                    interior: {
                        color: '#F2F2F2',
                        pattern: 'Solid',
                    },
                    alignment: {
                        horizontal: 'Center',
                        vertical: 'Center',
                    },
                    borders: {
                        borderTop: {
                            lineStyle: 'Continuous',
                            weight: 0,
                            color: '#8EA9DB',
                        },
                        borderRight: {
                            lineStyle: 'Continuous',
                            weight: 0,
                            color: '#8EA9DB',
                        },
                        borderBottom: {
                            lineStyle: 'Continuous',
                            weight: 0,
                            color: '#8EA9DB',
                        },
                        borderLeft: {
                            lineStyle: 'Continuous',
                            weight: 0,
                            color: '#8EA9DB',
                        },
                    },
                },
                {
                    id: 'currencyCell',
                    alignment: {
                        horizontal: 'Center',
                        vertical: 'Center',
                    },
                    numberFormat: {
                        format: '[$$-409]#,##0',
                    },
                },
                {
                    id: 'booleanType',
                    dataType: 'boolean',
                    alignment: {
                        vertical: 'Center',
                    },
                },
                {
                    id: 'countryCell',
                    alignment: {
                        indent: 4,
                    },
                },
            ],
        }),
        [isSmall]
    );


    const convertInstrumentDetailsToRowItem = (instrumentDetails) => {
        const datePart = instrumentDetails.sessionEnd.split('T')[0];

        const [year, month, day] = datePart.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        const sessionCloseDate = new Date(instrumentDetails.sessionEnd);

        const closingHours = String(sessionCloseDate.getHours()).padStart(2, '0');
        const closingMinutes = String(sessionCloseDate.getMinutes()).padStart(2, '0');
        // Format as "HH:mm:ss"
        const sessionOpenDate = new Date(instrumentDetails.sessionStart);
        const openingHours = String(sessionOpenDate.getHours()).padStart(2, '0');
        const openingMinutes = String(sessionOpenDate.getMinutes()).padStart(2, '0');
        // Format as "HH:mm:ss"
        const formattedSessionTime = `${openingHours}:${openingMinutes}-${closingHours}:${closingMinutes}`;
        const precision = instrumentDetails.precision;
        // tradeEntryAt:"2023-08-25T02:33:52-04:00"
        // tradeExitAt:"2023-08-25T02:34:19-04:00"
        // phighTouchAt:"2023-08-25T03:07:12-04:00"
        // plowTouchAt:null
        const highTouchedAt = instrumentDetails.phighTouchAt === null ? null : new Date(instrumentDetails.phighTouchAt);
        const lowTouchedAt = instrumentDetails.plowTouchAt === null ? null : new Date(instrumentDetails.plowTouchAt);
        const tradeEntry = instrumentDetails.tradeEntryAt === null ? null : new Date(instrumentDetails.tradeEntryAt);
        const tradeExit = instrumentDetails.tradeExitAt === null ? null : new Date(instrumentDetails.tradeExitAt);



        return {
            'date':formattedDate,
            'name': instrumentDetails.name,
            'symbol': instrumentDetails.symbol,
            'securityType': instrumentDetails.securityType,
            'bto': instrumentDetails.bto,
            'price_high': instrumentDetails.phigh.toFixed(precision),
            'price_low': instrumentDetails.plow.toFixed(precision),
            'price_trend': instrumentDetails.ptrend,
            'action': instrumentDetails.tradeSide,
            'entry_price': instrumentDetails.entryPrice.toFixed(precision),
            'take_profit': instrumentDetails.takeProfit.toFixed(precision),
            'stop_loss': instrumentDetails.stopLoss.toFixed(precision),
            'status': instrumentDetails.status,
            'session_time': formattedSessionTime,
            'high_touched_at': highTouchedAt,
            'low_touched_at': lowTouchedAt,
            'trade_entry_at': tradeEntry,
            'trade_exit_at': tradeExit,
        };
    }

    const createData = (date) => {
        console.log('createData called with date: ' + date + ' type of date: ' + typeof date);
        loadInstance.current = loadInstance.current + 1;
        const loadInstanceCopy = loadInstance.current;

        if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.showLoadingOverlay();
        }

        const colDefs = createCols();
        const rowCount = getRowCount();

        let row = 0;
        const data = [];

        setShowMessage(true);
        setMessage(` Generating rows`);

        getDayDetails(date).then(
            (response) => {
                console.log(response);
                const instrumentDayDetails = response.data;

                for (let i = 0; i < instrumentDayDetails.length && row < rowCount; i++) {
                    const rowItem = convertInstrumentDetailsToRowItem(instrumentDayDetails[i]);
                    data.push(rowItem);
                    row++;
                }

                setShowMessage(false);
                setMessage('');
                setColumnDefs(colDefs);
                setRowData(data);
            }
        ).catch((error) => {
            console.error("Error occurred while fetching instruments:", error);
        });
    };


    useEffect(() => {
        const small = IS_SSR
            ? false
            : document.documentElement.clientHeight <= 415 || document.documentElement.clientWidth < 768;
        setIsSmall(small);

        //put in the month cols

        let defaultCols;
        let defaultColCount;
        if (small) {
            defaultCols = mobileDefaultCols;
            defaultColCount = defaultCols.length;
        } else {
            defaultCols = desktopDefaultCols;
            defaultColCount = 22;
        }

        setDefaultCols(defaultCols);
        setDefaultColCount(defaultColCount);

        const newRowsCols = [
            [1, defaultColCount],
            [5, defaultColCount],
            [10, defaultColCount],
            [15, defaultColCount],
            [20, defaultColCount],
            [25, defaultColCount],
            [50, defaultColCount],
            [75, defaultColCount],
            [100, defaultColCount],
            [1000, defaultColCount],
        ];

        if (!small) {
            newRowsCols.push([10000, 100], [50000, defaultColCount], [100000, defaultColCount]);
        }

        setDataSize(createDataSizeValue(newRowsCols[8][0], newRowsCols[8][1]));

        setRowCols(newRowsCols);
    }, []);

    useEffect(() => {
        const flags = {};
        const promiseArray = countries.map((country) => {
            const countryCode = COUNTRY_CODES[country.country];

            return fetch(`https://flagcdn.com/w20/${countryCode}.png`)
                .then((response) => response.blob())
                .then(
                    (blob) =>
                        new Promise((res) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                flags[countryCode] = reader.result;
                                res(reader.result);
                            };
                            reader.readAsDataURL(blob);
                        })
                );
        });

        Promise.all(promiseArray).then(() => setBase64Flags(flags));
    }, []);

    const getColCount = () => {
        return parseInt(dataSize.split('x')[1], 10);
    };

    const getRowCount = () => {
        const rows = parseFloat(dataSize.split('x')[0]);

        return rows * 1000;
    };

    const createCols = () => {
        const colCount = getColCount();
        // start with a copy of the default cols
        const columns = defaultCols.slice(0, colCount);

        for (let col = defaultColCount; col < colCount; col++) {
            const colName = colNames[col % colNames.length];
            const colDef = { headerName: colName, field: 'col' + col, width: 200, editable: true };
            columns.push(colDef);
        }

        return columns;
    };

    useEffect(() => {
        if (dataSize) {
            createData(null);
        }
    }, [dataSize]);

    useEffect(() => {
        if (!gridTheme) return;
        const isDark = gridTheme.indexOf('dark') >= 0;

        if (isDark) {
            gridOptions.chartThemes = [
                'ag-default-dark',
                'ag-material-dark',
                'ag-pastel-dark',
                'ag-vivid-dark',
                'ag-solar-dark',
            ];
        } else {
            gridOptions.chartThemes = null;
        }
    }, [gridTheme]);
    // const [lastUpdateTime, setLastUpdateTime] = useState({});

    const updateLTP = (symbol, newLTP) => {
        gridOptions.api.forEachNode((node) => {
            if (node.data.symbol === symbol) {
                // const now = Date.now();
                // const diff = now - lastUpdateTime[symbol];
                // if (diff < 3000) {
                //     return;
                // }


                // setLastUpdateTime({ ...lastUpdateTime, [symbol]: now });
                const currentLTP = node.data.ltp;

                // console.log('currentLTP', currentLTP, 'symbol', symbol, 'newLTP', newLTP, 'node', node, 'node.data', node.data, 'node.data.ltp', node.data.ltp, 'node.data.ltChange', node.data.ltpChange);
                let ltpChange = 'unchanged';
                if (newLTP > currentLTP) ltpChange = 'increased';
                else if (newLTP < currentLTP) ltpChange = 'decreased';
                // console.log('currentLTP ', currentLTP, 'for ', symbol, 'decreased: ', (newLTP < currentLTP), 'increased: ', (newLTP > currentLTP), 'newLTP', newLTP, ltpChange);
                if(ltpChange === 'unchanged') {
                    console.log('UNCHANGED')
                }
                node.data.ltpChange = ltpChange;

                // Update the 'ltp' field with the new value
                node.setDataValue('ltp', newLTP);
            }
        });
    };

    const freezePrices = () => {
        if (gridOptions && gridOptions.api && typeof gridOptions.api.forEachNode === 'function') {
            gridOptions.api.forEachNode((node) => {
                node.data.ltpChange = 'frozen';
                node.setDataValue('ltp', node.data.ltp);
            });
        } else {
            if(gridOptions) {
                console.error('gridOptions not null: ', gridOptions);
                if(gridOptions.api) {
                    console.error('gridOptions.api not null: ', gridOptions.api);
                    if(gridOptions.api.forEachNode) {
                        console.error('gridOptions.api.forEachNode not null: ', gridOptions.api.forEachNode);
                        console.error('gridOptions.api.forEachNode is not a function: ', typeof gridOptions.api.forEachNode);
                    }
                }
            }
            console.error('gridOptions.api is not properly initialized.');
        }
    };



    // const socket = new SockJS('http://localhost:8089/ws');
    // const stompClient = new Client({
    //     webSocketFactory: () => socket,
    //     onConnect: (frame) => {
    //         stompClient.subscribe('/topic/update', (message) => {
    //             const data = JSON.parse(message.body);
    //             const { symbol, last } = data;
    //             updateLTP(symbol, last); // Assuming updateLTP is the function to update the grid
    //         });
    //     },
    //     onStompError: (frame) => {
    //         // STOMP protocol-level error
    //         console.error('Broker reported error: ' + frame.headers['message']);
    //         console.error('Additional details: ' + frame.body);
    //         freezePrices(); // Assuming freezeUI is the function to freeze the user interface
    //     },
    //     onWebSocketClose: (event) => {
    //         // Connection closed
    //         console.error('WebSocket connection closed', event);
    //         freezePrices(); // Assuming freezeUI is the function to freeze the user interface
    //     },
    //     onWebSocketError: (event) => {
    //         // WebSocket error
    //         console.error('WebSocket error observed:', event);
    //         freezePrices(); // Assuming freezeUI is the function to freeze the user interface
    //     }
    // });
    // stompClient.activate();
    const handleFilterChange = (event) => {
        const filterModel = event.api.getFilterModel();

        // Check if the date column has a filter applied
        if (filterModel && filterModel.date) {
            const dateFilter = filterModel.date;

            // For 'equals' type filter, you'll have the 'dateFrom' property
            if (dateFilter.type === 'equals' && dateFilter.dateFrom) {
                console.log(`User picked this date: ${dateFilter.dateFrom}`);
                createData(dateFilter.dateFrom);
            }

            // Prevent the default behavior by removing the filter for the date column
            event.api.setFilterModel({ ...filterModel, date: null });
        }
    };

    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" />
                {helmet.map((entry) => entry)}
            </Helmet>
            <div className={classnames(styles.exampleWrapper)}>
                <Toolbar
                    gridRef={gridRef}
                    dataSize={dataSize}
                    setDataSize={setDataSize}
                    rowCols={rowCols}
                    gridTheme={gridTheme}
                    setGridTheme={setGridTheme}
                />
                {/*<span className={classnames({ [styles.messages]: true, [styles.show]: showMessage })}>*/}
                {/*    {message}*/}
                {/*    <i className="fa fa-spinner fa-pulse fa-fw margin-bottom" />*/}
                {/*</span>*/}
                <Resizable
                leftChild={
                    // <div className={styles.gridWrapper} style={{ padding: '1rem', paddingTop: 0 }}>
                    //     {
                            gridTheme && (
                            <div id="myGrid" style={{ height: '100%', flex: '1 1 auto', overflow: 'hidden' }} className={gridTheme}>
                                <AgGridReactMemo
                                    key={gridTheme}
                                    ref={gridRef}
                                    modules={modules}
                                    gridOptions={gridOptions}
                                    columnDefs={columnDefs}
                                    rowData={rowData}
                                    defaultCsvExportParams={defaultExportParams}
                                    defaultExcelExportParams={defaultExportParams}
                                    onFilterChanged={handleFilterChange}
                                />
                            </div>
                        )
                        // }
                    // </div>
                }
                rightChild={<TVChartContainer/>}
                // rightChild={<></>}
                />

            </div>
        </>
    );
};

export default Dashboard;
