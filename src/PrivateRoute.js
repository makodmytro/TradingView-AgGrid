import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
    let location = useLocation();
    if (!isLoggedIn) {
        return <Navigate to="/" replace state={{ from: location , preserveIfLoggedIn:true }} />;
    }
    return <Component {...rest} />;
};

export default PrivateRoute;
