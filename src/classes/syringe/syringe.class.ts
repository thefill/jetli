import {IInjection, ISyringe} from '../../interfaces';

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
        return typeof argument === 'function';
    }

    protected dependencies: { [key: string]: IInjection | any } = {};
    protected instantiatedDependencies: { [key: string]: IInjection | any } = {};

    /**
     * Register dependency (also primitive values) by key - will be initialised
     * immediately if initialise set to true.
     * @param {string} key
     * @param {{new(): (IInjection | T)}} Dependency
     * @param {boolean} initialise Should Syringe initialise immediately
     */
    public set<T = any>(
        key: string,
        Dependency: new () => IInjection | T,
        initialise = false
    ): void {
        if (this.instantiatedDependencies[key] || this.dependencies[key]) {
            throw new Error(`Injectable with key ${key} already set`);
        }

        this.dependencies[key] = Dependency;

        // if required initialised
        if (initialise) {
            this.initialisedDependency<T>(key);
            return;
        }

    }

    /**
     * Retrieve injection by its class / constructor or key
     * @param {{new(): (IInjection | T)} | string} Dependency
     * @returns {T}
     */
    public get<T = any>(Dependency: (new () => IInjection | T) | string): T {
        if (typeof Dependency === 'string') {
            return this.initialisedDependency<T>(Dependency);
        }

        // Allow to retrieve dependency via 'get' using only constructors.
        if (!Syringe.isConstructor(Dependency)) {
            throw new Error(`
                Provided dependency not an constructor. 
                To inject primitive values register them using 'set' method first.
            `);
        }

        // Use constructor name as key
        const dependencyKey = Dependency.name;

        return this.initialisedDependency<T>(dependencyKey);
    }

    /**
     * Instantiates dependency registered with provided key.
     * If constructor, initialised immediately if IInjection, returns instantiated object.
     * @param {string} key
     * @returns {T}
     */
    protected initialisedDependency<T = any>(
        key: string
    ): T {
        if (
            !this.dependencies[key] &&
            !this.instantiatedDependencies[key]
        ) {
            throw new Error(`Injectable with key ${key} not registered`);
        }

        if (this.instantiatedDependencies[key]) {
            return this.instantiatedDependencies[key];
        }

        // if registered but not initialised do that now
        const Dependency = this.dependencies[key];
        let dependency;
        if (Syringe.isConstructor(Dependency)) {
            dependency = new Dependency();
        } else {
            dependency = Dependency;
        }

        // if has init property and init is an callable method
        if (dependency.init && typeof dependency.init === 'function') {
            // initialise injectable
            dependency.init(this);
        }

        this.instantiatedDependencies[key] = dependency;
        delete this.dependencies[key];

        return dependency;
    }
}
