import React from 'react';
import ExampleStyle from './ExampleStyle';
import Extras from './Extras';
import { LoadingSpinner } from './LoadingSpinner';
import MetaData from './MetaData';
import Scripts from './Scripts';
import Styles from './Styles';
import SystemJs from './SystemJs';

/**
 * This is the template for executing React examples in the example runner.
 */
const ReactTemplate = ({
    isExecuting,
    modifiedTimeMs,
    library,
    boilerplatePath,
    appLocation,
    options,
    scriptFiles,
    styleFiles,
    importType,
    type,
    internalFramework,
}) => (
    <html lang="en">
        <head>
            <MetaData
                title="React example"
                modifiedTimeMs={modifiedTimeMs}
                isExecuting={isExecuting}
                options={options}
            />
            <ExampleStyle rootId="root" />
            {(type !== 'generated' || library !== 'grid') && <Styles files={styleFiles} />}
            <Extras options={options} />
        </head>
        <body>
            <div id="root"></div>

            <LoadingSpinner />

            <Scripts files={scriptFiles} />
            <SystemJs
                library={library}
                boilerplatePath={boilerplatePath}
                appLocation={appLocation}
                startFile={appLocation + (internalFramework === 'reactFunctionalTs' ? 'index.tsx' : 'index.jsx')}
                framework={'react'}
                importType={importType}
                options={options}
            />
        </body>
    </html>
);

export default ReactTemplate;
