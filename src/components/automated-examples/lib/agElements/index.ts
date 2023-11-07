import { findElementWithInnerText, getBoundingClientPosition, PositionLocation } from '../dom';
import { Point } from '../geometry';
import {
    AgElementByFindConfig,
    AgElementByInnerTextConfig,
    AgElementBySelectorConfig,
    AgElementName,
    agElementsConfig,
} from './agElementsConfig';

interface CreateAgElementFinderParams {
    containerEl?: HTMLElement;
}

export type AgElementFinder = ReturnType<typeof createAgElementFinder>;
export interface AgElement {
    get: () => HTMLElement | undefined;
    getPos: (positionLocation?: PositionLocation) => Point | undefined;
}
export type GetElement = (target: AgElementName, targetParams?: any) => AgElement | undefined;

export function createAgElementFinder({ containerEl = document.body }: CreateAgElementFinderParams) {
    const getElement: GetElement = (target, targetParams) => {
        const agElementConfig = agElementsConfig[target];
        if (!agElementConfig) {
            return;
        }
        let element: HTMLElement | undefined;

        if (agElementConfig.hasOwnProperty('selector')) {
            const config = agElementConfig as AgElementBySelectorConfig;
            element = containerEl.querySelector(config.selector) as HTMLElement;
        } else if (agElementConfig.hasOwnProperty('innerTextSelector')) {
            const config = agElementConfig as AgElementByInnerTextConfig;
            element = findElementWithInnerText({
                containerEl,
                selector: config.innerTextSelector,
                text: targetParams.text,
            });
        } else if (agElementConfig.hasOwnProperty('find')) {
            const config = agElementConfig as AgElementByFindConfig<any>;
            element = config.find({
                getElement,
                containerEl,
                params: targetParams,
            });
        }

        return {
            get: () => element,
            getPos: (positionLocation?: PositionLocation) =>
                element ? getBoundingClientPosition({ element, positionLocation }) : undefined,
        };
    };

    return {
        get: getElement,
    };
}
