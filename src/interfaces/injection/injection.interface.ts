import {IJetli} from '../jetli';

/**
 * Interface to which should adhere if they want to be initialised by Jetli
 */
export interface IInjection {
    init: (interject: IJetli) => void;
}
