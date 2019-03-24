import {IInterject} from '../interject';

/**
 * Interface to which should adhere if they want to be initialised by Interject
 */
export interface IInjection {
    init: (interject: IInterject) => void;
}
