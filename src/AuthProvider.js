import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken ] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Check local storage for auth information
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn) {
            setIsLoggedIn(true);
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const userDataString = localStorage.getItem('auth');
            const userData = JSON.parse(userDataString);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUserData(userData);
        } else {
            setIsLoggedIn(false); // Set to false if does not exist
        }
    }, []);

    console.log("AuthProvider.js: isLoggedIn: ", isLoggedIn);

    // Public function to update accessToken, refreshToken, and userData
    const updateAuthData = (newAccessToken, newRefreshToken, newUserData) => {
        console.log("AuthProvider.js: updateAuthData: newAccessToken: ", newAccessToken);
        // Update state
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUserData(newUserData);
        setIsLoggedIn(true);
        // Update local storage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('auth', JSON.stringify(newUserData));
        localStorage.setItem('isLoggedIn', 'true');

        console.log("AuthProvider.js: updateAuthData: isLoggedIn: ", isLoggedIn);
        console.log("AuthProvider.js: access token ", accessToken);
        console.log("AuthProvider.js: userData ", userData);
    };

    useEffect(() => {
        console.log("==============================>>>> Updated isLoggedIn: ", isLoggedIn);
        console.log("==============================>>>> Updated access token: ", accessToken);
    }, [isLoggedIn, accessToken]);

    const clearLocalAuthData = () => {
        // Update state
        setAccessToken(null);
        setRefreshToken(null);
        setUserData(null);
        setIsLoggedIn(false);
        // Update local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth');
        localStorage.removeItem('isLoggedIn');
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn,
            updateAuthData, clearLocalAuthData, accessToken, refreshToken, userData }}>
            {children}
        </AuthContext.Provider>
    );
};
