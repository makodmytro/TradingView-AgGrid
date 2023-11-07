import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import RouteManager from './RouteManager';

function App() {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <div className="App">
            <Router>
                <RouteManager isLoggedIn={isLoggedIn} />
            </Router>
        </div>
    );
}

export default App;
