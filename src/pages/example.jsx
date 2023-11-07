import React from 'react';
import Dashboard from '../dashboard/Dashboard';
import Seo from './components/SEO';

const ExamplePage = () => {
    return (
        <>
            <Seo
                title="AG Grid: Demo of high performance datagrid"
                description="AG Grid is a feature-rich datagrid available in Community or Enterprise versions. This is our fully interactive demo showcasing all of our features and our performance with large datasets."
            />
            <Dashboard />
        </>
    );
};

export default ExamplePage;
