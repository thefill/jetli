import {IJetli} from '../jetli';

/**
 * Interface for internal jetli dependency config store
 */
export interface IDependencyConfig {
    dependency: IJetli | any;
    args: any[];
}
