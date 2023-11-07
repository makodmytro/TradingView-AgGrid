/* eslint-disable */

import classnames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import { Icon } from '../components/Icon.tsx';
import { trackDemoToolbar, trackOnceDemoToolbar } from '../utils/analytics.ts';
import styles from './Toolbar.dark.module.scss';
import { createDataSizeValue } from './utils';
import {AuthContext} from "../AuthProvider";
import {Link, useNavigate} from "react-router-dom";

const IS_SSR = typeof window === 'undefined';

export const Toolbar = ({ gridRef, dataSize, setDataSize,
                            rowCols, gridTheme, setGridTheme,
                            handleChangePassword, generateBrokerList,
                            handleFileUpload, handleAddProduct }) => {
    const {  clearLocalAuthData, userData } = useContext(AuthContext);  // Get setIsLoggedIn from context
    const [brokerList, setBrokerList] = useState(null); // Initial state set to null
    const navigate = useNavigate();

    useEffect(() => {
        if (userData.role === 'Admin' && generateBrokerList) {
            // I assume generateBrokerList() resolves to some kind of JSX or array of JSX elements
            generateBrokerList().then(result => {
                setBrokerList(result);
            }).catch(error => {
                console.error("Error generating broker list:", error);
            });
        }
    }, [userData, generateBrokerList]);

    function onDataSizeChanged(event) {
        const value = event.target.value;
        setDataSize(value);
        trackDemoToolbar({
            type: 'dataSize',
            value
        });
    }

    const handleLogout = () => {

        console.log("Logout button clicked");
        // Remove the tokens from local storage
        clearLocalAuthData();

        // Redirect to auth page (or any other action)
        navigate('/');
    };

    function onThemeChanged(event) {
        const newTheme = event.target.value || 'ag-theme-none';
        setGridTheme(newTheme);
        trackDemoToolbar({
            type: 'theme',
            value: newTheme
        });

        if (!IS_SSR) {
            let url = window.location.href;
            if (url.indexOf('?theme=') !== -1) {
                url = url.replace(/\?theme=[\w-]+/, `?theme=${newTheme}`);
            } else {
                const sep = url.indexOf('?') === -1 ? '?' : '&';
                url += `${sep}theme=${newTheme}`;
            }
            history.replaceState({}, '', url);
        }
    }

    function onFilterChanged(event) {
        gridRef.current.api.setQuickFilter(event.target.value);
        trackOnceDemoToolbar({
            type: 'filterChange',
        })
    }

    return (
        <>
            <div className={styles.toolbar}>
                <div className={classnames('page-margin', styles.controlsContainer)}>
                    <div className={styles.controls}>
                        {/*<label htmlFor="data-size">Data Size:</label>*/}
                        {/*<select id="data-size" onChange={onDataSizeChanged} value={dataSize}>*/}
                        {/*    {rowCols.map((rowCol) => {*/}
                        {/*        const rows = rowCol[0];*/}
                        {/*        const cols = rowCol[1];*/}

                        {/*        const value = createDataSizeValue(rows, cols);*/}
                        {/*        const text = `${rows} Rows, ${cols} Cols`;*/}
                        {/*        return (*/}
                        {/*            <option key={value} value={value}>*/}
                        {/*                {text}*/}
                        {/*            </option>*/}
                        {/*        );*/}
                        {/*    })}*/}
                        {/*</select>*/}

                        <label htmlFor="grid-theme">Theme:</label>
                        <select id="grid-theme" onChange={onThemeChanged} value={gridTheme || ''}>
                            <option value="ag-theme-none">-none-</option>
                            <option value="ag-theme-alpine">Alpine</option>
                            <option value="ag-theme-alpine-dark">Alpine Dark</option>
                            <option value="ag-theme-balham">Balham</option>
                            <option value="ag-theme-balham-dark">Balham Dark</option>
                            <option value="ag-theme-material">Material</option>
                        </select>

                        <label htmlFor="global-filter">Filter:</label>
                        <input
                            placeholder="Filter any column..."
                            type="text"
                            onInput={onFilterChanged}
                            id="global-filter"
                            style={{ flex: 1 }}
                        />
                        {/* Navbar */}
                        <div className={styles.navbar}>
                            <Link to="/dashboard">Home</Link>
                            <Link to="/user">User</Link>
                            <Link to="/product">Product</Link>
                        </div>
                        {
                            generateBrokerList && userData.role === 'Admin' && brokerList
                        }
                        {
                            handleFileUpload && handleFileUpload()
                        }

                        {/* Right-aligned section */}
                        <div className={styles.rightSection}>
                            {
                                handleAddProduct &&
                                <button onClick={handleAddProduct}>
                                    Add Product
                                </button>
                            }
                            {
                                handleChangePassword &&
                                <button onClick={handleChangePassword}>
                                Change Password
                                </button>
                            }

                            {/* Logout Button */}
                            <button
                                className={styles.logoutButton}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
                <div className={styles.scrollIndicator}></div>
            </div>
        </>

    );
};
