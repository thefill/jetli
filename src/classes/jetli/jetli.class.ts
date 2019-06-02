import {IDependency, IDependencyConfig, IJetli} from '../../interfaces';

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
     * @param {IDependency} dependency
     * @param {boolean} initialiseOnRequest Should Jetli initialise immediately,
     *                                          or delay till injection requested
     * @param constructorArgs {...any} Arguments that should be passed to dependency
     *                                 constructor
     */
    public async set<T = any>(
        key: string,
        dependency: IDependency,
        initialiseOnRequest = true,
        ...constructorArgs
    ): Promise<void> {
        if (
            Jetli.inStore(this.dependencies, key) ||
            Jetli.inStore(this.initialisedDependencies, key)
        ) {
            throw new Error(`Injectable with key ${key} already set`);
        }

        if (typeof dependency === 'undefined') {
            throw new Error(`Provided dependency has value of undefined`);
        }

        this.dependencies[key] = {
            dependency: dependency,
            args: constructorArgs
        };

        // if required immediate initialisation
        if (!initialiseOnRequest) {
            await this.initialiseDependency<T>(key);
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
     * @param {IDependency | string} dependency
     * @returns {T}
     * @param constructorArgs {...any} Arguments that should be passed to dependency
     *                                 constructor
     */
    public async get<T = any>(
        dependency: IDependency | string,
        ...constructorArgs
    ): Promise<T> {
        if (typeof dependency === 'string') {
            return this.initialiseDependency<T>(dependency);
        }

        // Allow to retrieve dependency via 'get' using only constructors.
        if (!Jetli.isConstructor(dependency) || !dependency.name) {
            throw new Error(`
                Provided dependency not an constructor. 
                To inject primitive values register them using 'set' method first.
            `);
        }

        // Use constructor name as key
        const key = dependency.name;

        // if not in store add
        if (
            !Jetli.inStore(this.dependencies, key) &&
            !Jetli.inStore(this.initialisedDependencies, key)
        ) {
            this.dependencies[key] = {
                dependency: dependency,
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
    protected async initialiseDependency<T = any>(key: string): Promise<T> {
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
        const dependency = this.dependencies[key].dependency;
        const args = this.dependencies[key].args;

        let finalDependency;
        if (Jetli.isConstructor(dependency)) {
            finalDependency = new dependency(...args);
        } else {
            finalDependency = dependency;
        }

        this.initialisedDependencies[key] = {
            dependency: finalDependency,
            args: args
        };
        delete this.dependencies[key];

        // if has init property and init is an callable method
        if (finalDependency.init && typeof finalDependency.init === 'function') {
            // if not initialised yet
            if (typeof finalDependency.initialised === undefined || !finalDependency.initialised) {
                try {
                    // initialise injectable
                    await finalDependency.init(this);
                } catch (error) {
                    throw new Error(`Error while initialising dependency for key ${key}.`);
                }
            }
        }

        return finalDependency;
    }
}
