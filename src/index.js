import React from 'react';
import { createRoot } from 'react-dom/client';  // <-- Import createRoot
import './index.css';
import App from './App';
import { AuthProvider } from "./AuthProvider";
// import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const appRoot = createRoot(rootElement);  // <-- Use createRoot

appRoot.render(
    <React.StrictMode>
        <AuthProvider>  {/* <-- Wrap AuthProvider around your App */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);
