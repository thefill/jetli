import {IInjection} from '../injection';

/**
 * Interface for dependency
 */
export type IDependency<T = any> = (new (...args: any) => IInjection | T ) | T;
