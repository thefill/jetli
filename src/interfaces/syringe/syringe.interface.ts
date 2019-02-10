import {IInjection} from '../injection';

export interface ISyringe {
    set: (key: string, Dependency: new () => IInjection) => void;
    get: (Dependency: (new () => IInjection) | string) => any;
}
