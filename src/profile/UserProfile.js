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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import classnames from 'classnames';
import React, {memo, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Helmet} from 'react-helmet';
import styles from './UserProfile.module.scss';
import {Toolbar} from '../dashboard/Toolbar.jsx';
import {useApiCalls} from "../api/API";

import {
    axisLabelFormatter,
    booleanCleaner,
    createDataSizeValue,
    currencyFormatter,
    formatThousands,
    numberParser,
    sharedNumberParser,
    suppressColumnMoveAnimation,
} from '../dashboard/utils';
import {WinningsFilter} from '../dashboard/WinningsFilter';
import {colNames, countries, COUNTRY_CODES, months} from "../dashboard/consts";
import {InstrumentFilter} from "../dashboard/InstrumentFilter";
import {InstrumentFloatingFilterComponent} from "../dashboard/InstrumentFloatingFilterComponent";
import {CountryFloatingFilterComponent} from "../dashboard/CountryFloatingFilterComponent";
import {CountryCellRendererJs} from "../dashboard/Dashboard";
import {AuthContext} from "../AuthProvider";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import {LicenseManager} from "@ag-grid-enterprise/core";

const IS_SSR = typeof window === 'undefined';

const helmet = [];

const AgGridReactMemo = memo(AgGridReact);



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

// const booleanFilterCellRenderer = (props) => {
//     const [valueCleaned] = useState(booleanCleaner(props.value));
//     if (valueCleaned === true) {
//         return <span title="true" className="ag-icon ag-icon-tick content-icon" />;
//     }
//
//     if (valueCleaned === false) {
//         return <span title="false" className="ag-icon ag-icon-cross content-icon" />;
//     }
//
//     if (props.value === '(Select All)') {
//         return props.value;
//     }
//     return '(empty)';
// };






const resetPasswordButtonRenderer = (props) => {

    const handleUpdate = () => {
        console.log('Update clicked');
        // Your update logic here
    };

    return <button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleUpdate}>Reset Password</button>;
};

const changePasswordButtonRenderer = (props) => {

    const handleUpdate = () => {
        console.log('Update clicked');
        // Your update logic here
    };

    return <button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleUpdate}>Change Password</button>;
};


const EmptyHeader = () => {
    return <div style={{ display: 'none' }}></div>;
};


const UserProfile = () => {
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
    const [inputRow, setInputRow] = useState({});
    const { getUserList, addUser, deleteUser, updateUser} = useApiCalls();
    const {userData} = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    LicenseManager.setLicenseKey("Using_this_AG_Grid_Enterprise_key_( AG-044608 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com)___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( AZH )_is_granted_a_( Single Application )_Developer_License_for_the_application_( AZH )_only_for_( 1 )_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_( AZH )_need_to_be_licensed___( AZH )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 4 July 2024 )____[v2]_MTcyMDA0NzYwMDAwMA==aa96bf6a52d48878edcfdcef745c0e32")

    const convertFetchedItems = (data) => {
        if(!data) return;

        return {
            "name": data.userDetails.name,
            "type": data.userDetails.type,
            "username": data.userDetails.id,
            "email": data.userDetails.email,
            "mobileTel": data.userDetails.mobileNo,
            "businessContact": data.userDetails.businessTel,
            "website": data.userDetails.website,
            "demoHost": data.serverDetails ? data.serverDetails.demoHost : '',
            "demoPort": data.serverDetails ? data.serverDetails.demoPort : '',
            "demoMtVersion": data.serverDetails ? data.serverDetails.demoVersion : '',
            "liveHost": data.serverDetails ? data.serverDetails.liveHost : '',
            "livePort": data.serverDetails ? data.serverDetails.livePort : '',
            "liveMtVersion": data.serverDetails ? data.serverDetails.liveVersion : '',
            "isModified": false,
            "userId": data.userDetails.id,
        }
    }

    const updateButtonRenderer = (props) => {
        const { isModified, isInputRow } = props.data;
        // console.log("====> rendering reset password button. data is : " , props);
        const handleUpdate = async () => {
            console.log('Update clicked');
            const updateUserRequest = {
                "userDetails": {
                    "name": props.data.name,
                    "type": props.data.type,
                    "email": props.data.email,
                    "mobileNo": props.data.mobileTel,
                    "businessTel": props.data.businessContact,
                    "website": props.data.website,
                },
                "serverDetails": props.data.type === 'Broker' ? {
                    "demoHost": props.data.demoHost,
                    "demoPort": props.data.demoPort,
                    "demoVersion": props.data.demoMtVersion,
                    "liveHost": props.data.liveHost,
                    "livePort": props.data.livePort,
                    "liveVersion": props.data.liveMtVersion,
                } : null
            }
            const response = await updateUser(props.data.userId, updateUserRequest);
            if(response && response.userDetails) {
                const updatedRowData = convertFetchedItems(response);
                props.node.setData(updatedRowData);
                toast.success("Oh toasty! 🍞 Your profile just got an update!",
                    {position: toast.POSITION.TOP_CENTER});
            } else {
                toast.error("Uh-oh! 🚫 The toast got burned. Please try updating your profile again.",
                    {position: toast.POSITION.TOP_CENTER});
            }
        };

        const handleSave = async () => {
            console.log('Save clicked', props.data);
            const createUserRequest = {
                "userDetails": {
                    "name": props.data.name,
                    "type": props.data.type,
                    "email": props.data.email,
                    "mobileNo": props.data.mobileTel,
                    "businessTel": props.data.businessContact,
                    "website": props.data.website,
                },
                "serverDetails": props.data.type === 'Broker' ? {
                    "demoHost": props.data.demoHost,
                    "demoPort": props.data.demoPort,
                    "demoVersion": props.data.demoMtVersion,
                    "liveHost": props.data.liveHost,
                    "livePort": props.data.livePort,
                    "liveVersion": props.data.liveMtVersion,
                } : null
            }

            const response = await addUser(createUserRequest);


            if(response && response.userDetails) {
                const emptyInputRow = {
                    type: props.data.originalUserType === 'Admin' ? 'Admin' : 'Investor',
                    isModified: false,
                    isInputRow: true,
                    originalUserType: props.data.originalUserType,
                    userId: props.data.userId,
                }
                props.node.setData(emptyInputRow);

                props.api.refreshCells({
                    rowNodes: [props.node],
                    columns: ['update'], // Replace with the field name of the column you want to refresh
                    force: true,
                });
                const newRowData = convertFetchedItems(response);
                props.api.applyTransaction({ add: [newRowData] });
                toast.success("Oh snap! 🎉 You singlehandedly crafted a brand new user. Nice work!",
                    {position: toast.POSITION.TOP_CENTER});
            } else {
                toast.error("Ah snap! 🚫 Something went toast-tally wrong. Couldn't create the new user. Try again!",
                    {position: toast.POSITION.TOP_CENTER});
            }
        };
        const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        const isValidTel = (tel) => /^[0-9]+$/.test(tel);
        const isValidWebsite = (website) => /\.[a-zA-Z]{2,}$/.test(website);
        // Function to validate host (naive)
        const isValidHost = (host) => /^[a-zA-Z0-9.-]+$/.test(host) || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host);

        // Function to validate port
        const isValidPort = (port) => /^\d+$/.test(port) && (0 < parseInt(port, 10) && parseInt(port, 10) < 65536);

        // Function to validate MT version
        const isValidMtVersion = (version) => ['MT4', 'MT5'].includes(version);
        console.log('====> rendering update button. data is : ' , props.data)
        let saveReady = false;
        if (isInputRow) {
            const data = props.data;
            //trimed name not empty
            const isNameValid = data.name && data.name.trim() !== "";
            //type is in ['Admin', 'Broker', 'Investor']
            const isTypeValid = ['Admin', 'Broker', 'Investor'].includes(data.type);
            //email is valid
            const isEmailValid = isValidEmail(data.email);

            //mobileTel is valid
            const isMobileTelValid = !data.mobileTel || isValidTel(data.mobileTel);

            //businessContact is valid or null
            const isBusinessContactValid = !data.businessContact || isValidTel(data.businessContact);

            //website is valid or null
            const isWebsiteValid = !data.website || isValidWebsite(data.website);
            //if type is broker, then demoHost, demoPort, demoMtVersion, liveHost, livePort, liveMtVersion are valid
            let areBrokerFieldsValid = true;
            if (data.type === 'Broker') {
                let isDemoPresent = data.demoHost || data.demoPort;
                let isLivePresent = data.liveHost || data.livePort;

                let areDemoFieldsValid = !isDemoPresent || (isValidHost(data.demoHost) && isValidPort(data.demoPort) && isValidMtVersion(data.demoMtVersion));
                let areLiveFieldsValid = !isLivePresent || (isValidHost(data.liveHost) && isValidPort(data.livePort) && isValidMtVersion(data.liveMtVersion));

                areBrokerFieldsValid = areDemoFieldsValid && areLiveFieldsValid;
            }

            console.log('name is valid: ', isNameValid, 'type is valid: ', isTypeValid, 'email is valid: ', isEmailValid, 'mobileTel is valid: ', isMobileTelValid
                , 'businessContact is valid: ', isBusinessContactValid, 'website is valid: ', isWebsiteValid, 'broker fields are valid: ', areBrokerFieldsValid)

            // Setting the saveReady flag
            saveReady = isNameValid && isTypeValid && isEmailValid && isMobileTelValid && isBusinessContactValid && isWebsiteValid && areBrokerFieldsValid;
        }
        // console.log("====> rendering update button. data is : " , props.data, saveReady, isModified, isInputRow)

        return isInputRow ?
            (
                <button
                    style={{ backgroundColor: saveReady ? 'green' : 'grey', color: 'white' }}
                    onClick={handleSave}
                    disabled={!saveReady}
                >
                    Save
                </button>
            )
            :
            (
                <button
                    style={{ backgroundColor: isModified ? 'green' : 'grey', color: 'white' }}
                    onClick={handleUpdate}
                    disabled={!isModified}
                >
                    Update
                </button>
            );
    };


    const deleteButtonRenderer = (props) => {
        const {isInputRow, originalUserType } = props.data;
        const handleDelete = async () => {
            console.log('Delete clicked');
            const resp = await deleteUser(props.data.userId);

            if(resp && resp.httpStatus === 'OK') {
                props.api.applyTransaction({remove: [props.node.data]});

                toast.success("Oh dear! 😢 You've just removed a user",
                    {position: toast.POSITION.TOP_CENTER});
            } else {
                toast.error("Ah-ha! 🚫 Couldn't delete the user.",
                    {position: toast.POSITION.TOP_CENTER});
            }
        };

        const handleReset = () => {
            console.log('Reset clicked');
            const emptyInputRow = {
                type: originalUserType === 'Admin' ? 'Admin' : 'Investor',
                isModified: false,
                isInputRow: true,
                originalUserType: originalUserType,
                userId: props.data.userId,
            }
            props.node.setData(emptyInputRow);

            props.api.refreshCells({
                rowNodes: [props.node],
                columns: ['update'], // Replace with the field name of the column you want to refresh
                force: true,
            });
        }
        return isInputRow ?
            (<button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleReset}>Reset</button>)
            :
            (<button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDelete}>Delete</button>);
    };

    function suppressArrowNavigation(params) {
        const isInputRow = params.node.data.isInputRow;
        const isEditing = params.editing;
        const event = params.event;
        const isArrowKey = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key);
        if (isInputRow && isArrowKey) {
            return true; // suppress the keyboard event if it's an input row and the key is an arrow key
        }
        return false;
    }

    const customStringCellRenderer = (props) => {
        const { isInputRow, originalUserType, type } = props.data;
        let { value } = props;

        if (!isInputRow) {
            return <span>{value}</span>;
        }

        const setInputValue = (props, value) => {
            // console.log("====> setting input value. data is : " ,props.colDef.field, props.data, value)
            props.node.setDataValue(props.colDef.field, value);
        };

        // const handleKeyDown = (e) => {
        //     if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        //         e.stopPropagation();
        //     }
        // };

        const renderInput = (props, placeholder, value = '') => (
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => setInputValue(props, e.target.value)}
                // onKeyDown={handleKeyDown} // Add this line
            />
        );

        const renderSelectWithType = (props, value) => {
            if (!value || value === '') {
                value = props.data.originalUserType === 'Admin' ? 'Admin' : 'Investor';
                setInputValue(props, value);
            }

            const handleOnChange = (e) => {
                const previousValue = value;
                const newValue = e.target.value;

                if (previousValue !== newValue) {
                    setInputValue(props, newValue);

                    if (newValue === 'Broker' || previousValue === 'Broker') {
                        props.api.redrawRows({ rowNodes: [props.node] });
                    }
                }
            };

            const userTypeOptions = props.data.originalUserType === 'Admin' ? ['Admin', 'Broker'] : ['Investor'];
            return renderSelect(props, userTypeOptions, value, handleOnChange);
        };

        const renderSelect = (props, options, value, customOnChange = null) => {
            if (!value || value === '') {
                setInputValue(props, options[0]);
            }
            return (
                    <select
                        value={value}
                        onChange={customOnChange || ((e) => setInputValue(props, e.target.value))}
                        // onKeyDown={handleKeyDown} // Add this line
                    >
                        {options.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                    </select>
                );
        }


        const field = props.colDef.field;
        const isBroker = type === 'Broker';

        switch (field) {
            case 'name': return renderInput(props, 'Enter name', value);
            case 'username': return <input type="text" placeholder="Will be generated" disabled />;
            case 'email': return renderInput(props, 'Enter email', value);
            case 'mobileTel': return renderInput(props, 'Enter mobile tel', value);
            case 'businessContact': return renderInput(props, 'Enter business tel', value);
            case 'website': return renderInput(props, 'Enter website', value);
            case 'type':
                return renderSelectWithType(props, value);
            case 'demoHost':
            case 'liveHost':
                if (isBroker) return renderInput(props, `Enter ${field.includes('demo') ? 'demo' : 'live'} host`, value);
                break;
            case 'demoPort':
            case 'livePort':
                if (isBroker) {
                    return renderInput(props, `Enter ${field.includes('demo') ? 'demo' : 'live'} port`, value || '0');
                }
                break;
            case 'demoMtVersion':
            case 'liveMtVersion':
                if (isBroker) return renderSelect(props, ['MT5', 'MT4'], value );
                break;
            default: return null;
        }
    };

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

    const desktopDefaultCols = [
        {
            headerName: 'User Details',
            groupId: 'user',
            children: [
                {
                    headerName: 'Name',
                    field: 'name',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 150,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Type',
                    field: 'type',
                    editable: false,
                    width: 100,
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: ['Investor', 'Brocker', 'Admin']
                    },
                    cellRenderer: 'customStringCellRenderer',
                },
                {
                    headerName: 'Username',
                    field: 'username',
                    editable: false,
                    floatingFilter: false,
                    width: 120,
                    cellRenderer: 'customStringCellRenderer',

                },
                {
                    headerName: 'Email',
                    field: 'email',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 180,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Mobile Tel',
                    field: 'mobileTel',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 150,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Business Contact',
                    columnGroupShow: 'open',
                    field: 'businessContact',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 150,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Website',
                    columnGroupShow: 'open',
                    field: 'website',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 150,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,
                }
            ]
        },
        {
            headerName: 'MT Demo Server Details',
            groupId: 'demo',
            children: [
                {
                    headerName: 'Host',
                    field: 'demoHost' ,
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 150,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Port',
                    columnGroupShow: 'open',
                    field: 'demoPort',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 80,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,
                },
                {
                    headerName: 'Version',
                    columnGroupShow: 'open',
                    field: 'demoMtVersion',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 85,
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: ['MT4', 'MT5']
                    },
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                }
            ]
        },
        {
            headerName: 'MT Live Server Details',
            groupId: 'live',
            children: [
                {
                    headerName: 'Host',
                    field: 'liveHost' ,
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 150,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Port',
                    columnGroupShow: 'open',
                    field: 'livePort' ,
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 80,
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                },
                {
                    headerName: 'Version',
                    columnGroupShow: 'open',
                    field: 'liveMtVersion',
                    editable: params => params.data.isInputRow !== true,
                    floatingFilter: false,
                    width: 85,
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: ['MT4', 'MT5']
                    },
                    cellRenderer: 'customStringCellRenderer',
                    suppressKeyboardEvent: suppressArrowNavigation,

                }
            ]
        },
        {
            headerName: 'Action',
            groupId: 'action',
            children: [
                {
                    headerName: 'Update',
                    field: 'update',
                    floatingFilter: false,
                    cellRenderer: 'updateButtonRenderer',
                    width: 100,
                    headerComponent: 'emptyHeader',
                },
                {
                    headerName: 'Delete',
                    field: 'delete',
                    floatingFilter: false,
                    cellRenderer: 'deleteButtonRenderer',
                    width: 100,
                    headerComponent: 'emptyHeader',
                },
            ],
            // You can add cell renderers or other options here
        }
    ]

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

    const handleCellValueChanged = (params) => {
        const rowIndex = params.rowIndex;
        // console.log('handleCellValueChanged', params, rowIndex, rowData)
        // const updatedRowData = [...rowData];
        // updatedRowData[rowIndex].isModified = true;
        // setRowData(updatedRowData);
        params.data.isModified = true;
        // Refresh the specific cell
        params.api.refreshCells({
            rowNodes: [params.node],
            columns: ['update'], // Replace with the field name of the column you want to refresh
            force: true,
        });
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
                // booleanFilterCellRenderer: booleanFilterCellRenderer,
                winningsFilter: WinningsFilter,
                resetPasswordButtonRenderer: resetPasswordButtonRenderer,
                updateButtonRenderer: updateButtonRenderer,
                deleteButtonRenderer: deleteButtonRenderer,
                changePasswordButtonRenderer: changePasswordButtonRenderer,
                emptyHeader: EmptyHeader,
                customStringCellRenderer: customStringCellRenderer,
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

    const fetchAndCreateRowData = async (user) => {
        console.log("fetchAndCreateRowData called", user)
        loadInstance.current = loadInstance.current + 1;
        // const loadInstanceCopy = loadInstance.current;
        if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.showLoadingOverlay();
        }
        const colDefs = createCols();
        const rowCount = getRowCount();
        let row = 0;
        const data = [];
        const userList = await getUserList();

        if(userList && userList.users) {
            // console.log("userList", userList)

            userList.users.forEach((user) => {
                data.push(convertFetchedItems(user));
            });
        }
        row = data.length;
        setShowMessage(false);
        setMessage('');
        setColumnDefs(colDefs);
        setRowData(data);
        // console.log('row data set', rowData)
        const inputRowPlaceholder = {
            // type: 'Admin', //getDefaultUserType(currentUserType),
            type: user.role === 'Admin' ? 'Admin' : 'Investor',
            isModified: false,
            isInputRow: true,
            originalUserType: user.role,
            userId: user.sub,
        }
        setInputRow(inputRowPlaceholder)
    }

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

    const handleChangePassword = (params) => {
        // toast.success('Password change clicked', {
        //     position: 'top-center',
        // })
        setIsModalOpen(true);
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

    // useEffect(() => {
    //     console.log('Updated rowData:', rowData);
    // }, [rowData]);


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
                    handleChangePassword={handleChangePassword}
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
                                pinnedTopRowData={[inputRow]}
                                // pinnedBottomRowData={[inputRow]}
                                // onFilterChanged={handleFilterChange}
                            />
                        </div>
                    )}
                </section>
            </div>
            <ChangePasswordModal
                isOpen={isModalOpen}
                closeModal={(showToast) => {
                    setIsModalOpen(false);
                    console.log("closeModal called", showToast)
                    if (showToast === true) {
                        toast.success("Password changed successfully!",
                            {
                                position: 'top-center',
                            });
                    }
                }}
            />
            <ToastContainer />
        </>
    );
}

export default UserProfile;