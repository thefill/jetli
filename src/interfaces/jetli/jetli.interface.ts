import {IInjection} from '../injection';

/**
 * Interface for the dependency injector.
 */
export interface IJetli {
    set: <T = any>(
        key: string,
        Dependency: new () => IInjection | T,
        initialiseOnRequest: boolean,
        ...constructorArgs
    ) => void;
    get: <T = any>(
        Dependency: (new () => IInjection | T) | string,
        ...constructorArgs
    ) => T;
}
