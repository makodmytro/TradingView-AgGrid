import { describe, it, expect, beforeEach, beforeAll, jest } from '@jest/globals';

jest.mock('../documentation-helpers');
jest.mock('../use-json-file-nodes');

import * as fs from 'fs';
import { buildModel, loadLookups } from './model';
import { getJsonFromFile } from '../documentation-helpers';

describe('ExpandableSnippet Model', () => {
    let mockInterfaces: {};
    let mockDocInterfaces: {};

    let loadedInterfaces: {};
    let loadedDocInterfaces: {};

    beforeAll(() => {
        mockInterfaces = JSON.parse(fs.readFileSync('./src/components/expandable-snippet/test-interfaces.AUTO.json').toString());
        mockDocInterfaces = JSON.parse(fs.readFileSync('./src/components/expandable-snippet/test-doc-interfaces.AUTO.json').toString());
        (getJsonFromFile as any)
            .mockReturnValueOnce(mockInterfaces)
            .mockReturnValueOnce(mockDocInterfaces);
    
        const loaded = loadLookups('test');
        loadedInterfaces = loaded.interfaceLookup;
        loadedDocInterfaces = loaded.codeLookup;
    });

    for (const root of ['AgCartesianChartOptions']) {
        describe(`for ${root}`, () => {
            it('builds a consistent model', () => {
                const model = buildModel(root, loadedInterfaces, loadedDocInterfaces);
        
                expect(model).toMatchSnapshot();
            });
        });
    }
});
