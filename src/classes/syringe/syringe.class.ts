import {IDependencyConfig, IInjection, ISyringe} from '../../interfaces';

/**
 * Main class for dependency injector.
 */
export class Syringe implements ISyringe {

    /**
     * Check if provided argument is an constructor
     * @param argument
     * @returns {boolean}
     */
    protected static isConstructor(argument) {
        return typeof argument === 'function' && argument.name;
    }

    protected dependencies: { [key: string]: IDependencyConfig } = {};
    protected instantiatedDependencies: { [key: string]: IDependencyConfig } = {};

    /**
     * Register dependency (also primitive values) by key - will be initialised
     * immediately if initialise set to true.
     * @param {string} key
     * @param {{new(): (IInjection | T)}} Dependency
     * @param {boolean} initialiseOnRequest Should Syringe initialise immediately,
     *                                          or delay till injection requested
     * @param constructorArgs {...any} Arguments that should be passed to dependency
     *                                 constructor
     */
    public set<T = any>(
        key: string,
        Dependency: new () => IInjection | T,
        initialiseOnRequest = false,
        // TODO: add here constructor arguments as spread args?
        ...constructorArgs
    ): void {
        if (this.instantiatedDependencies[key] || this.dependencies[key]) {
            throw new Error(`Injectable with key ${key} already set`);
        }

        if (typeof Dependency === 'undefined') {
            throw new Error(`Provided dependency has value of undefined`);
        }

        this.dependencies[key] = {
            dependency: Dependency,
            args: constructorArgs
        };

        // if required immediate initialisation
        if (!initialiseOnRequest) {
            this.initialisedDependency<T>(key);
            return;
        }

    }

    /**
     * Retrieve injection by its class / constructor or key
     * @param {{new(): (IInjection | T)} | string} Dependency
     * @returns {T}
     * @param constructorArgs {...any} Arguments that should be passed to dependency
     *                                 constructor
     */
    public get<T = any>(
        Dependency: (new () => IInjection | T) | string,
        ...constructorArgs
    ): T {
        if (typeof Dependency === 'string') {
            return this.initialisedDependency<T>(Dependency);
        }

        // Allow to retrieve dependency via 'get' using only constructors.
        if (!Syringe.isConstructor(Dependency) || !Dependency.name) {
            throw new Error(`
                Provided dependency not an constructor. 
                To inject primitive values register them using 'set' method first.
            `);
        }

        // Use constructor name as key
        const key = Dependency.name;

        // if not in store add
        if (
            !this.dependencies[key] &&
            !this.initialisedDependency[key]
        ) {
            this.dependencies[key] = {
                dependency: Dependency,
                args: constructorArgs
            };
        }

        return this.initialisedDependency<T>(key);
    }

    /**
     * Instantiates dependency registered with provided key.
     * If constructor, initialised immediately if IInjection, returns instantiated object.
     * @param {string} key
     * @returns {T}
     */
    protected initialisedDependency<T = any>(key: string): T {
        if (
            !this.dependencies[key] &&
            !this.instantiatedDependencies[key]
        ) {
            throw new Error(`Dependency for key ${key} not registered`);
        }

        if (this.instantiatedDependencies[key]) {
            return this.instantiatedDependencies[key].dependency;
        }

        // if registered but not initialised do that now
        const Dependency = this.dependencies[key].dependency;
        const args = this.dependencies[key].args;
        let dependency;
        if (Syringe.isConstructor(Dependency)) {
            dependency = new Dependency(...args);
        } else {
            dependency = Dependency;
        }

        // if has init property and init is an callable method
        if (dependency.init && typeof dependency.init === 'function') {
            // initialise injectable
            dependency.init(this);
        }

        this.instantiatedDependencies[key] = {
            dependency: dependency,
            args: args
        };
        delete this.dependencies[key];

        return dependency;
    }
}
