import {ISyringe} from '../syringe';

/**
 * Interface for internal syringe dependency config store
 */
export interface IDependencyConfig {
    dependency: ISyringe | any;
    args: any[];
}
