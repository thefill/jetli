import {IDependencyConfig, IInjection, IJetli} from '../../interfaces';

/**
 * Main class for dependency injector.
 */
export class Jetli implements IJetli {

    /**
     * Check if provided argument is an constructor
     * @param argument
     * @returns {boolean}
     */
    protected static isConstructor(argument) {
        return !!argument.name && typeof argument === 'function';
    }

    /**
     * Checks if key in store
     * @param {object} store
     * @param {string} key
     * @returns {boolean}
     */
    protected static inStore(store: { [key: string]: any }, key: string): boolean {
        const storeKeys = Object.keys(store);

        return storeKeys.includes(key);
    }

    protected dependencies: { [key: string]: IDependencyConfig } = {};
    protected initialisedDependencies: { [key: string]: IDependencyConfig } = {};

    /**
     * Register dependency (also primitive values) by key - will be initialised
     * immediately if initialise set to true.
     * @param {string} key
     * @param {{new(): (IInjection | T)}} Dependency
     * @param {boolean} initialiseOnRequest Should Jetli initialise immediately,
     *                                          or delay till injection requested
     * @param constructorArgs {...any} Arguments that should be passed to dependency
     *                                 constructor
     */
    public set<T = any>(
        key: string,
        Dependency: new () => IInjection | T,
        initialiseOnRequest = true,
        ...constructorArgs
    ): void {
        if (
            Jetli.inStore(this.dependencies, key) ||
            Jetli.inStore(this.initialisedDependencies, key)
        ) {
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
            this.initialiseDependency<T>(key);
            return;
        }
    }

    /**
     * Unregister dependency (also primitive values) by key
     * @param {string} key
     */
    public unset<T = any>(
        key: string
    ): void {
        delete this.dependencies[key];
        delete this.initialisedDependencies[key];
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
            return this.initialiseDependency<T>(Dependency);
        }

        // Allow to retrieve dependency via 'get' using only constructors.
        if (!Jetli.isConstructor(Dependency) || !Dependency.name) {
            throw new Error(`
                Provided dependency not an constructor. 
                To inject primitive values register them using 'set' method first.
            `);
        }

        // Use constructor name as key
        const key = Dependency.name;

        // if not in store add
        if (
            !Jetli.inStore(this.dependencies, key) &&
            !Jetli.inStore(this.initialisedDependencies, key)
        ) {
            this.dependencies[key] = {
                dependency: Dependency,
                args: constructorArgs
            };
        }

        return this.initialiseDependency<T>(key);
    }

    /**
     * Instantiates dependency registered with provided key.
     * If constructor, initialised immediately if IInjection, returns instantiated object.
     * @param {string} key
     * @returns {T}
     */
    protected initialiseDependency<T = any>(key: string): T {
        if (
            !Jetli.inStore(this.dependencies, key) &&
            !Jetli.inStore(this.initialisedDependencies, key)
        ) {
            throw new Error(`Dependency for key ${key} not registered`);
        }

        if (Jetli.inStore(this.initialisedDependencies, key)) {
            return this.initialisedDependencies[key].dependency;
        }

        // if registered but not initialised do that now
        const Dependency = this.dependencies[key].dependency;
        const args = this.dependencies[key].args;
        let dependency;
        if (Jetli.isConstructor(Dependency)) {
            dependency = new Dependency(...args);
        } else {
            dependency = Dependency;
        }

        this.initialisedDependencies[key] = {
            dependency: dependency,
            args: args
        };
        delete this.dependencies[key];
        
        // if has init property and init is an callable method
        if (dependency.init && typeof dependency.init === 'function') {
            // initialise injectable
            dependency.init(this);
        }

        return dependency;
    }
}
