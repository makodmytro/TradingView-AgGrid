import React from 'react';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import UserProfile from './profile/UserProfile';
import Login from './auth/Login';
import PrivateRoute from './PrivateRoute';
import Register from "./auth/Register";
import PasswordReset from "./auth/PasswordReset";
import Product from "./admin-dashboard/Product";
import TVChartContainer from "./chart/TVChartContainer";

const ConditionalRoute = ({ isLoggedIn, type }) => {
    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }
    if (type === 'login') {
        return <Login />;
    }
    if (type === 'register') {
        return <Register />;
    }
    if (type === 'password-reset') {
        return <PasswordReset />;
    }
    return <Navigate to="/" replace />;
};
const RouteManager = ({ isLoggedIn }) => {

    const location = useLocation();

    const from = location.state?.from || '/';
    const fromPrivateRoute = location.state?.preserveIfLoggedIn || false;

    // console.log("RouteManager.js: isLoggedIn: ", isLoggedIn, from, fromPrivateRoute);

    if(fromPrivateRoute && isLoggedIn){
        return <Navigate to={from} replace />;
    }

    return (
        <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/forget" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <PasswordReset />} />
            <Route path="/dashboard" element={<PrivateRoute isLoggedIn={isLoggedIn} component={Dashboard} />} />
            <Route path="/product" element={<PrivateRoute isLoggedIn={isLoggedIn} component={Product} />} />
            <Route path="/user" element={<PrivateRoute isLoggedIn={isLoggedIn} component={UserProfile} />} />
            <Route path="/chart" element={<PrivateRoute isLoggedIn={isLoggedIn} component={TVChartContainer} />} />
        </Routes>
    );
};

export default RouteManager;
