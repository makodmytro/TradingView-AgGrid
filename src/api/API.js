import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider';

function parseJwt(accessToken) {
    try {
        // Split the JWT token into its parts
        const [headerEncoded, payloadEncoded] = accessToken.split('.');

        // Base64Url decode the payload
        const payloadDecoded = atob(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/'));

        // Parse the payload as JSON
        const payloadObject = JSON.parse(payloadDecoded);

        // Log or return the payload
        // console.log('JWT payload:', payloadObject);
        return payloadObject;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
    }
}

export const useApiCalls = () => {
    const { accessToken, refreshToken, userData, updateAuthData } = useContext(AuthContext);

    // const BASE_URL = "http://10.39.1.121:8080/";
    // const BASE_URL = "http://192.168.200.36:8080/";

    const BASE_URL = process.env.REACT_APP_BASE_URL
    async function refreshTokenAndUpdate()   {
        const renewTokenUrl = BASE_URL + "auth/renew-token";
        try {
            const response = await fetch(renewTokenUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const renewedTokens = await response.json();
            const newUserData = parseJwt(renewedTokens.accessToken);
            updateAuthData(renewedTokens.accessToken, renewedTokens.refreshToken, newUserData);
        } catch (error) {
            console.error("Error renewing the token:", error);
        }
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('There was an error!', error);
            return null;
        }
    }


    async function getWithAuth(url) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (userData && userData.exp < currentTimestamp) {
            await refreshTokenAndUpdate();
        }
        console.log("getWithAuth: userData: ", userData)
        // console.log("getWithAuth: accessToken: ", accessToken);
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('There was an error!', error);
            return null;
        }

    }

    async function postWithAuth(url, body) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (userData && userData.exp < currentTimestamp) {
            await refreshTokenAndUpdate();
        }
        // console.log("getWithAuth: accessToken: ", accessToken);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                //maybe do something with the code
                // if(response.text())
                // throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Read the raw body first.
            const rawBody = await response.text();
            try {
                // Try to parse the raw body as JSON.
                return JSON.parse(rawBody);
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                // If JSON parsing fails, return the raw body.
                return rawBody;
            }
        } catch (error) {
            console.error('There was an error!', error);
            return null;
        }
    }

    async function patchWithAuth(url, body) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (userData && userData.exp < currentTimestamp) {
            await refreshTokenAndUpdate();
        }
        // console.log("getWithAuth: accessToken: ", accessToken);
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('There was an error!', error);
            return null;
        }
    }



    async function deleteWithAuth(url) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (userData && userData.exp < currentTimestamp) {
            await refreshTokenAndUpdate();
        }
        console.log("deleteWithAuth: userData: ", userData )
        // console.log("getWithAuth: accessToken: ", accessToken);
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('There was an error!', error);
            return null;
        }
    }

    async function getInstruments() {
        return fetchData(BASE_URL + "instrument");
    }



    async function getSymbols() {
        return fetchData(BASE_URL + "instrument/symbols");
    }

    async function login(emailOrUsername, password) {
        const url = BASE_URL + "auth/login";
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailOrUsername,
                    password
                })
            });

            if (!response.ok) {
                //maybe do something with the code
                // if(response.text())
                // throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("login: response: ", response);

            // Read the raw body first.
            const rawBody = await response.text();
            console.log("login: rawBody: ", rawBody);
            try {
                // Try to parse the raw body as JSON.
                return JSON.parse(rawBody);
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                // If JSON parsing fails, return the raw body.
                return rawBody;
            }
        } catch (error) {
            console.error('There was an error!', error);
            return null;
        }
    }

    async function getUserList() {


        const url = BASE_URL + "user";
        return getWithAuth(url);//replace with fetch with auth
    }
    async function getDayDetails(date) {
        let url = BASE_URL + "instrument/day-details";
        if (date) {
            url += `?date=${date.split(' ')[0]}`;
        }
        return getWithAuth(url);
    }

    async function addUser(addUserRequest) {
        let url = BASE_URL + "user";
        return postWithAuth(url, addUserRequest);
    }

    async function deleteUser(userId) {
        let url = BASE_URL + "user/" + userId;
        return deleteWithAuth(url);
    }

    async function updateUser(userId, updateUserRequest) {
        let url = BASE_URL + "user/" + userId;
        return patchWithAuth(url, updateUserRequest);
    }

    async function changePassword(oldPassword, newPassword) {
        let url = BASE_URL + "auth/change-password";
        return postWithAuth(url, {
            oldPassword,
            newPassword
        });
    }

    async function requestPasswordReset(email) {
        let url = BASE_URL + "auth/forgot-password";
        return postWithAuth(url, {
            email
        });
    }

    async function resetPassword(email, passwordResetCode, newPassword) {
        let url = BASE_URL + "auth/reset-password";
        return postWithAuth(url, {
            email,
            passwordResetCode,
            newPassword
        });
    }

    async function getProductList(brokerId) {
        let url = BASE_URL + "instrument/list/details";
        if(brokerId) {
            url += `?brokerId=${brokerId}`;
        }
        return getWithAuth(url);
    }

    async function updateProductData(symbol, name, takeProfit, stopLoss) {
        let url = BASE_URL + "instrument/" + encodeURIComponent(symbol);
        return patchWithAuth(url, {
            description: name,
            takeProfitOffsetInPercentage: takeProfit,
            stopLossOffsetInPercentage: stopLoss
        });
    }

    async function toggleVisibility(symbol) {
        let url = BASE_URL + "instrument/" + encodeURIComponent(symbol) + "/toggle-visibility";
        return patchWithAuth(url, {});
    }

    async function getBrokerList() {
        let url = BASE_URL + "user/broker";
        return getWithAuth(url);
    }

    async function getBrokerSymbol(brokerId) {
        let url = BASE_URL + "instrument/broker/" + brokerId + "/symbols";
        return getWithAuth(url);
    }

    async function createNewProduct(request) {
        let url = BASE_URL + "instrument";
        return postWithAuth(url,{
            rootSymbol: request.rootSymbol,
            systemSymbol: request.systemSymbol,
            description: request.name,
            takeProfitOffsetInPercentage: request.takeProfit,
            stopLossOffsetInPercentage: request.stopLoss
        });
    }

    async function getProductDetails(symbol) {
        let url = BASE_URL + "instrument/" + encodeURIComponent(symbol) ;
        return getWithAuth(url);
    }


    async function getHistoryCandle(symbol, resolution, from, to) {
        let url = BASE_URL + "instrument/" + encodeURIComponent(symbol) + "/history-candle";
        let params = new URLSearchParams({
            'from': from,
            'to': to,
            'limit': 2000,
            'resolution': resolution
        });

        // Appending the query parameters to the base URL
        url += '?' + params.toString();
        return getWithAuth(url);

    }
    async function getAllProductList() {
        let url = BASE_URL + "instrument/list";
        return getWithAuth(url);
    }


    return {
        getDayDetails,
        login,
        getUserList,
        addUser,
        deleteUser,
        updateUser,
        changePassword,
        requestPasswordReset,
        resetPassword,
        getProductList,
        updateProductData,
        toggleVisibility,
        getBrokerList,
        getBrokerSymbol,
        createNewProduct,
        getProductDetails,
        getHistoryCandle,
        getAllProductList,
    };
};
