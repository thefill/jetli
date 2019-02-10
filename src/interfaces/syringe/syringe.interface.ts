import {IInjection} from '../injection';

/**
 * Interface for the dependency injector.
 */
export interface ISyringe {
    set: (key: string, Dependency: new () => IInjection) => void;
    get: (Dependency: (new () => IInjection) | string) => any;
}
