import {ISyringe} from '../syringe';

/**
 * Interface to which should adhere if they want to be initialised by Syringe
 */
export interface IInjection {
    init: (syringe: ISyringe) => void;
}
