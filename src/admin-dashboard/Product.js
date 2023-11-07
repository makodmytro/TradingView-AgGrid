import React, {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import classnames from "classnames";
import styles from "../profile/UserProfile.module.scss";
import {Toolbar} from "../dashboard/Toolbar";
import {toast, ToastContainer} from "react-toastify";
import {ClientSideRowModelModule} from "@ag-grid-community/client-side-row-model";
import {CsvExportModule} from "@ag-grid-community/csv-export";
import {ClipboardModule} from "@ag-grid-enterprise/clipboard";
import {ColumnsToolPanelModule} from "@ag-grid-enterprise/column-tool-panel";
import {ExcelExportModule} from "@ag-grid-enterprise/excel-export";
import {FiltersToolPanelModule} from "@ag-grid-enterprise/filter-tool-panel";
import {GridChartsModule} from "@ag-grid-enterprise/charts";
import {MasterDetailModule} from "@ag-grid-enterprise/master-detail";
import {MenuModule} from "@ag-grid-enterprise/menu";
import {MultiFilterModule} from "@ag-grid-enterprise/multi-filter";
import {RangeSelectionModule} from "@ag-grid-enterprise/range-selection";
import {RichSelectModule} from "@ag-grid-enterprise/rich-select";
import {RowGroupingModule} from "@ag-grid-enterprise/row-grouping";
import {SetFilterModule} from "@ag-grid-enterprise/set-filter";
import {SideBarModule} from "@ag-grid-enterprise/side-bar";
import {StatusBarModule} from "@ag-grid-enterprise/status-bar";
import {SparklinesModule} from "@ag-grid-enterprise/sparklines";
import {InstrumentFilter} from "../dashboard/InstrumentFilter";
import {InstrumentFloatingFilterComponent} from "../dashboard/InstrumentFloatingFilterComponent";
import {CountryCellRendererJs} from "../dashboard/Dashboard";
import {CountryFloatingFilterComponent} from "../dashboard/CountryFloatingFilterComponent";
import {WinningsFilter} from "../dashboard/WinningsFilter";
import {
    axisLabelFormatter,
    createDataSizeValue,
    formatThousands,
    sharedNumberParser,
    suppressColumnMoveAnimation
} from "../dashboard/utils";
import {colNames, months} from "../dashboard/consts";
import {AgGridReact} from "@ag-grid-community/react";
import {AuthContext} from "../AuthProvider";
import {useApiCalls} from "../api/API";
import AutocompleteSelectCellEditor from "./AutocompleteSelectCellEditor";
import AddProductModal from "./AddProductModal";
import {LicenseManager} from "@ag-grid-enterprise/core";

const IS_SSR = typeof window === 'undefined';

const helmet = [];

const AgGridReactMemo = memo(AgGridReact);
const EmptyHeader = () => {
    return <div style={{ display: 'none' }}></div>;
};

const Product = () => {
    const gridRef = useRef(null);
    const loadInstance = useRef(0);
    const [gridTheme, setGridTheme] = useState(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const theme = params.get('theme') || 'ag-theme-balham-dark';
        setGridTheme(theme);
    }, []);
    const [defaultCols, setDefaultCols] = useState();
    const [isSmall, setIsSmall] = useState(false);
    const [defaultColCount, setDefaultColCount] = useState();
    const [columnDefs, setColumnDefs] = useState();
    const [rowData, setRowData] = useState();
    const [message, setMessage] = useState();
    const [showMessage, setShowMessage] = useState(false);
    const [rowCols, setRowCols] = useState([]);
    const [dataSize, setDataSize] = useState();
    const {userData} = useContext(AuthContext);
    const { getProductList, updateProductData,
        toggleVisibility, getBrokerList, getBrokerSymbol,
        createNewProduct, getProductDetails} = useApiCalls();
    const [mtSymbolFile, setMtSymbolFile] = useState(null);
    const [uploadedMtSymbols, setUploadedMtSymbols] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    LicenseManager.setLicenseKey("Using_this_AG_Grid_Enterprise_key_( AG-044608 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com)___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( AZH )_is_granted_a_( Single Application )_Developer_License_for_the_application_( AZH )_only_for_( 1 )_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_( AZH )_need_to_be_licensed___( AZH )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 4 July 2024 )____[v2]_MTcyMDA0NzYwMDAwMA==aa96bf6a52d48878edcfdcef745c0e32")

    const updateButtonRenderer = (props) => {
        const {data, node} = props;
        const { isModified } = data;
        const handleUpdate = async () => {
            // console.log('Update clicked data is', data);
            // const response = await updateUser(props.data.userId, updateUserRequest);
            const response = await updateProductData(
                data.root,
                data.name,
                data.takeProfitOffset,
                data.stopLossOffset
            )
            if(response && response.symbol && response.symbol === data.root) {
                const updatedRowData = convertProduct(response);
                node.setData(updatedRowData);
                toast.success("Oh toasty! 🍞 Your just updated " + updatedRowData.name + "!",
                    {position: toast.POSITION.TOP_CENTER});
            } else {
                toast.error("Uh-oh! 🚫 The toast got burned. Please try updating again.",
                    {position: toast.POSITION.TOP_CENTER});
            }
        };
        return (
                <button
                    style={{ backgroundColor: isModified ? 'green' : 'grey', color: 'white' }}
                    onClick={handleUpdate}
                    disabled={!isModified}
                >
                    Update
                </button>
            );
    };
    const toggleHideButtonRenderer = (props) => {

        const { isHidden } = props.data;

        const toggleHide = async () => {
            // console.log(isHidden ? 'Unhide clicked' : 'Hide clicked');
            // You can put your logic to toggle the visibility here.
            const response = await toggleVisibility(
                props.data.root
            )
            if(response && response.symbol && response.symbol === props.data.root) {
                const updatedRowData = convertProduct(response);
                props.node.setData(updatedRowData);

                if (updatedRowData.isHidden === true) {
                    toast.warning("Oops! 🙈 You just tucked away " + updatedRowData.name + "!",
                        {position: toast.POSITION.TOP_CENTER});
                } else {
                    toast.success("Oh toasty! 🍞 You just brought out " + updatedRowData.name + "!",
                        {position: toast.POSITION.TOP_CENTER});
                }
            } else {
                toast.error("Uh-oh! 🚫 The toast got burned. Please try updating again.",
                    {position: toast.POSITION.TOP_CENTER});
            }
        };

        const buttonStyle = {
            backgroundColor: isHidden ?  'blue' : 'orange',
            color: 'white'
        };

        return (
            <button
                style={buttonStyle}
                onClick={toggleHide}
            >
                {isHidden ? 'Unhide' : 'Hide'}
            </button>
        );
    };





    const desktopDefaultCols = [
        {
            headerName: 'Products',
            children: [
                {
                    headerName: 'Name',
                    field: 'name',
                    editable: userData.role === 'Admin',
                    width: 200,
                },
                {
                    headerName: 'Root',
                    field: 'root',
                    editable: false,
                    width: 120,
                },
                {
                    headerName: 'MT Symbol',
                    field: 'mtSymbol',
                    editable: userData.role === 'Admin' || userData.role === 'Broker',
                    hide: userData.role !== 'Broker',
                    width: 120,
                    cellEditor: uploadedMtSymbols === null ?'agTextCellEditor':'autocompleteSelectCellEditor',
                    cellEditorParams: {
                        values: uploadedMtSymbols,
                    },
                },
                {
                    headerName: 'Take Profit Offset (%)',
                    field: 'takeProfitOffset',
                    editable: userData.role === 'Admin',
                    width: 152,
                },
                {
                    headerName: 'Stop Loss Offset (%)',
                    field: 'stopLossOffset',
                    editable: userData.role === 'Admin' ,
                    width: 150,
                },
                {
                    headerName: 'Trading Hours',
                    field: 'tradingHours',
                    editable: false,
                    width: 120,
                },
                {
                    headerName: 'Security Type',
                    field: 'securityType',
                    editable: false,
                    width: 120,
                },
                {
                    headerName: 'Exchange',
                    field: 'exchange',
                    editable: false,
                    width: 100,
                },
                {
                    headerName: 'Entry Price',
                    field: 'entryPrice',
                    floatingFilter: false,
                    editable: false,
                    width: 100,
                },
                {
                    headerName: 'Opening Side',
                    field: 'openingSide',
                    floatingFilter: false,
                    editable: false,
                    width: 80,
                },
                {
                    headerName: 'Profit Target',
                    field: 'profitTarget',
                    floatingFilter: false,
                    editable: false,
                    width: 100,
                },
                {
                    headerName: 'Max Loss',
                    field: 'maxLoss',
                    floatingFilter: false,
                    editable: false,
                    width: 100,
                }
                ]
        },
        {
            headerName: 'Actions',
            children: [
                {
                    headerName: 'Update',
                    field: 'update',
                    editable: false,
                    floatingFilter: false,
                    headerComponent: 'emptyHeader',
                    width: 100,
                    cellRenderer: 'updateButtonRenderer',
                },
                ...(userData.role==="Admin"?[{
                    headerName: 'Hide',
                    field: 'isHidden',
                    editable: false,
                    floatingFilter: false,
                    headerComponent: 'emptyHeader',
                    width: 100,
                    cellRenderer: 'toggleHideButtonRenderer',
                }] : [])
                ]
        }
    ]

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
        })
    );
    const selectionChanged = (event) => {
        // console.log('Callback selectionChanged: selection count = ' + gridOptions.api.getSelectedNodes().length);
    };
    const handleCellValueChanged = (params) => {
        params.data.isModified = true;
        // Refresh the specific cell
        params.api.refreshCells({
            rowNodes: [params.node],
            columns: ['update'], // Replace with the field name of the column you want to refresh
            force: true,
        });
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
                // booleanFilterCellRenderer: booleanFilterCellRenderer,
                winningsFilter: WinningsFilter,
                updateButtonRenderer: updateButtonRenderer,
                toggleHideButtonRenderer: toggleHideButtonRenderer,
                emptyHeader: EmptyHeader,
                autocompleteSelectCellEditor: AutocompleteSelectCellEditor
            },
            defaultColDef: {
                minWidth: 50,
                sortable: true,
                filter: true,
                floatingFilter: !isSmall,
                resizable: true,
                cellDataType: false,
                // tooltipComponent: CustomTooltip,
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
            // suppressRowTransform: true,
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
            // autoGroupColumnDef: groupColumn,
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
                defaultToolPanel: 'columns',
                hiddenByDefault: isSmall,
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
            onCellValueChanged: (params) => {handleCellValueChanged(params)},
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
                    id: 'booleanType',
                    dataType: 'boolean',
                    alignment: {
                        vertical: 'Center',
                    },
                },
            ],
        }),
        [isSmall]
    );
    useEffect(() => {
        const small = IS_SSR
            ? false
            : document.documentElement.clientHeight <= 415 || document.documentElement.clientWidth < 768;
        setIsSmall(small);

        //put in the month cols

        let defaultCols = desktopDefaultCols;
        let defaultColCount = 14;
        // let defaultColCount;
        // if (small) {
        //     defaultCols = mobileDefaultCols;
        //     defaultColCount = defaultCols.length;
        // } else {
        //     defaultCols = desktopDefaultCols;
        //     defaultColCount = 22;
        // }

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

    const convertProduct = (product) => {
        if(!product) return;


        const sessionCloseDate = new Date(product.sessionEnd);

        const closingHours = String(sessionCloseDate.getHours()).padStart(2, '0');
        const closingMinutes = String(sessionCloseDate.getMinutes()).padStart(2, '0');
        // Format as "HH:mm:ss"
        const sessionOpenDate = new Date(product.sessionStart);
        const openingHours = String(sessionOpenDate.getHours()).padStart(2, '0');
        const openingMinutes = String(sessionOpenDate.getMinutes()).padStart(2, '0');
        // Format as "HH:mm:ss"
        const formattedSessionTime = `${openingHours}:${openingMinutes}-${closingHours}:${closingMinutes}`;

        const calculatedProfitTarget = product.openingSide === 'BUY' ?
            product.entryPrice * (1 + product.takeProfitPercentage / 100) :
            (product.openingSide === 'SELL' ? product.entryPrice * (1 - product.takeProfitPercentage / 100) : null)
        const calculatedMaxLoss = product.openingSide === 'BUY' ?
            product.entryPrice * (1 - product.stopLossPercentage / 100) :
            (product.openingSide === 'SELL' ? product.entryPrice * (1 + product.stopLossPercentage / 100) : null)
        return {
            "name": product.name,
            "root": product.symbol,
            "mtSymbol": product.mtSymbol,
            "takeProfitOffset": product.takeProfitPercentage,
            "stopLossOffset": product.stopLossPercentage,
            "tradingHours": formattedSessionTime,
            "securityType": product.securityType,
            "exchange": product.exchange,
            "entryPrice": product.entryPrice ? product.entryPrice.toFixed(product.precision) : null,
            "openingSide": product.openingSide,
            "profitTarget": calculatedProfitTarget ? calculatedProfitTarget.toFixed(product.precision) : null,
            "maxLoss": calculatedMaxLoss ? calculatedMaxLoss.toFixed(product.precision) : null,
            "isHidden" : product.isHidden,
            "isModified": false,
        };
    }

    const fetchAndCreateRowData = async (user) => {
        console.log("fetchAndCreateRowData called", user)
        loadInstance.current = loadInstance.current + 1;
        // const loadInstanceCopy = loadInstance.current;
        if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.showLoadingOverlay();
        }
        const data = [];

        //TODO: check if user is admin and any broker id selected
        const resp = await getProductList();
        if(resp && resp.data) {
            resp.data.forEach((p) => {
                data.push(convertProduct(p))
            })
        }

        setRowData(data);
        const colDefs = createCols();
        console.log("colums: ", colDefs)
        setShowMessage(false);
        setMessage('');
        setColumnDefs(colDefs);
    }
    useEffect(() => {
        if (dataSize) {
            fetchAndCreateRowData(userData);
        }
    }, [dataSize, userData]);

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

    const handleSelectBroker = async (event) => {
        // console.log("handleSelectBroker called", event.target.value)

        // console.log("=========================> grid option", gridOptions)
        if (event.target.value && event.target.value === "0") {
            //find column with filed name mtSymbol
            //remove the values and hide the column
            gridOptions.rowData.forEach((row) => {
                    row.mtSymbol = null;
            });
            gridOptions.columnApi.setColumnVisible('mtSymbol', false);
        } else if (event.target.value) {
            const resp = await getBrokerSymbol(event.target.value)
            if(resp && resp.data) {
                const sMap = resp.data.reduce((acc, curr) => {
                   acc[curr.originalSymbol] = curr.brokerSymbol;
                   return acc;
                }, {});
                gridOptions.rowData.forEach((row) => {
                   if(sMap[row.root]) {
                       row.mtSymbol = sMap[row.root];
                   } else {
                          row.mtSymbol = null;
                   }
                });
                gridOptions.api.refreshCells({
                    columns: ['mtSymbol'],
                    force: true
                });
                gridOptions.columnApi.setColumnVisible('mtSymbol', true);
            }

            //TODO: if any broker is selected
            //TODO: fetch mt5 symbol list for the selected broker
            //TODO: update the mt5 symbol column in the grid
            //TODO: refresh all rows
        }

    }
    const generateBrokerList = async () => {
        const response = await getBrokerList();
        let brokers = [ {
            id: 0,
            name: "Admin"
        }];
        if(response && response.data) {
            response.data.forEach((b) => {
                brokers.push({
                    id: b.id,
                    name: b.name
                });
            });
        }
        return (
            <>
                <label htmlFor="broker-select-product">Select Broker:</label>
                <select id={"broker-select-product"} onChange={handleSelectBroker}>
                    {brokers.map(b => <option value={b.id} key={b.name}>{b.name}</option>)}
                </select>
            </>

        )
    }

    const handleFileChange = (event) => {
        console.log("=========>> file selected: ", event.target.files[0])
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if(selectedFile.type === "application/json") {

                const reader = new FileReader();
                reader.readAsText(selectedFile);
                reader.onload = () => {

                    // console.log("=========>> file content: ",reader.result)
                    setMtSymbolFile(selectedFile);
                    let data = JSON.parse(reader.result);
                    const mtSymbOptions = data.map(item => item.brokerSymbol)
                    setUploadedMtSymbols(mtSymbOptions);
                    console.log("=========>> mt symbol list: ", mtSymbOptions)
                    console.log("=========>> columns list: ", gridOptions.columnDefs)

                    let workDone = false;
                    const productsObject = gridOptions.columnDefs.find(item => item.headerName === "Products");

                    if (productsObject && productsObject.children) {
                        const mtSymbolChild = productsObject.children.find(child => child.headerName === "MT Symbol");
                        if (mtSymbolChild) {
                            mtSymbolChild.cellEditor = 'autocompleteSelectCellEditor'; // replace with your new value// replace with your new value
                            mtSymbolChild.hide = false;
                            mtSymbolChild.cellEditorParams = { values: mtSymbOptions}; // replace with your new params
                            gridOptions.api.setColumnDefs(gridOptions.columnDefs);
                            toast.success("Oh toasty! 🍞 " + selectedFile.name + " file is loaded", {
                                position: toast.POSITION.TOP_CENTER
                            })
                            workDone = true;
                            // gridOptions.api.refreshCells({
                            //     columns: ['mtSymbol'],
                            //     force: true
                            // });
                        }
                    }
                    if(!workDone) {
                        toast.error("Uh-oh! 🚫 " + selectedFile.name + " is not a valid json file", {
                            position: toast.POSITION.TOP_CENTER
                        })
                    }
                }
                reader.onerror = () => {
                    toast.error("Uh-oh! 🚫 error while reading" + selectedFile.name, {
                        position: toast.POSITION.TOP_CENTER
                    })
                }

            } else {
                toast.error("Uh-oh! 🚫 " + selectedFile.name + " is not a valid json file", {
                    position: toast.POSITION.TOP_CENTER
                })
            }
        }
    }


    const handleClearFile = (event) => {
        setMtSymbolFile(null);
        setUploadedMtSymbols(null);
        let workDone = false;
        const productsObject = gridOptions.columnDefs.find(item => item.headerName === "Products");

        if (productsObject && productsObject.children) {
            const mtSymbolChild = productsObject.children.find(child => child.headerName === "MT Symbol");
            if (mtSymbolChild) {
                mtSymbolChild.cellEditor = 'agTextCellEditor'; // replace with your new value
                gridOptions.api.setColumnDefs(gridOptions.columnDefs);
                toast.success("Oh toasty! 🍞 symbol list unloaded", {
                    position: toast.POSITION.TOP_CENTER
                })
                workDone = true;
                // gridOptions.api.refreshCells({
                //     columns: ['mtSymbol'],
                //     force: true
                // });
            }
        }
    }

    const handleFileUpload = () => {
        return (
            <>
                {
                    mtSymbolFile ?
                        <button
                            style={
                                {
                                    maxWidth: '150px',  // Adjust as needed
                                    height: '30px',     // Adjust as needed
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    padding: '5px 10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: '#fa3c3c'
                                }
                        }
                            onClick={handleClearFile}>Clear {mtSymbolFile.name}</button>
                        :
                        <input type="file" onChange={handleFileChange} />

                }
                {/*<input type="file" onChange={handleFileChange} />*/}
                {/*<p>{mtSymbolFile && mtSymbolFile.name}</p>*/}
            </>
        );
    }

    const handleAddProduct = () => {
        setIsModalOpen(true);
    }

    const addNewProduct = async (productDetails) => {
        const resp = await createNewProduct(productDetails);

        console.log("addNewProduct called", resp);

        if(resp && resp.httpStatus==="OK") {
            //product added successfully
            getProductDetails(productDetails.rootSymbol).then( response =>{
                if(response && response.symbol === productDetails.rootSymbol) {
                    // console.log("details product::: ", response);
                    const newRow = convertProduct(response);
                    gridOptions.api.applyTransaction({ add: [newRow] });
                }
            })
            return true;
        }
        return resp;
    }

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
                    generateBrokerList={generateBrokerList}
                    handleSelectBroker={handleSelectBroker}
                    handleFileUpload={handleFileUpload}
                    handleAddProduct={handleAddProduct}
                />
                <span className={classnames({ [styles.messages]: true, [styles.show]: showMessage })}>
                    {message}
                    <i className="fa fa-spinner fa-pulse fa-fw margin-bottom" />
                </span>
                <section className={styles.gridWrapper} style={{ padding: '1rem', paddingTop: 0 }}>
                    {gridTheme && (
                        <div id="userList" style={{ flex: '1 1 auto', overflow: 'hidden' }} className={gridTheme}>
                            <AgGridReactMemo
                                key={gridTheme}
                                ref={gridRef}
                                modules={modules}
                                gridOptions={gridOptions}
                                columnDefs={columnDefs}
                                rowData={rowData}
                                defaultCsvExportParams={defaultExportParams}
                                defaultExcelExportParams={defaultExportParams}
                                // pinnedTopRowData={[inputRow]}
                                // pinnedBottomRowData={[inputRow]}
                                // onFilterChanged={handleFilterChange}
                            />
                        </div>
                    )}
                </section>
            </div>
            <AddProductModal
                isOpen={isModalOpen}
                closeModal={(productDetails) => {
                    // console.log("closeModal called", showToast)
                    if (productDetails && productDetails.name) {
                        addNewProduct(productDetails).then(resp => {
                            if(resp===true) {
                                setIsModalOpen(false);
                                toast.success("Product added successfully!",
                                    {
                                        position: 'top-center',
                                    });
                            } else {

                                if(typeof resp === "string") {
                                    console.log("Toast error: string resp", resp)
                                    toast.error("Uh-oh! 🚫 " + resp, {
                                        position: toast.POSITION.TOP_CENTER
                                    })
                                }else {
                                    console.log("Toast error: object resp", resp)
                                    toast.error("Uh-oh! 🚫 " + resp.message ? resp.message : " Something went wrong", {
                                        position: toast.POSITION.TOP_CENTER
                                    })
                                }
                            }
                        });

                    } else {
                        setIsModalOpen(false);
                    }
                }}
            />
            <ToastContainer />
        </>
    );
}

export default Product