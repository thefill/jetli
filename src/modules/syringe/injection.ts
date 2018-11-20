import {ISyringe} from './syringe-class';

export interface IInjection {
    initialise: (syringe: ISyringe) => void;
}
