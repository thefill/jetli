import {IJetli} from '../jetli';

/**
 * Interface to which should adhere if they want to be initialised by Jetli
 */
export interface IInjection {
    /**
     * Indicates if injectable object already initialised
     */
    initialised?: boolean;

    /**
     * Initialises injectable
     * @param {IJetli} interject
     */
    init: (interject: IJetli) => any;
}
