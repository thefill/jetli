import {IInterject} from '../interject';

/**
 * Interface for internal interject dependency config store
 */
export interface IDependencyConfig {
    dependency: IInterject | any;
    args: any[];
}
