import {IInjection} from './injection';

export interface ISyringe {
    set: (key: string, Dependency: new () => IInjection) => void;
    get: (Dependency: new () => IInjection | string) => any;
}

export class Syringe implements ISyringe {

    private dependencies: { [key: string]: IInjection } = {};

    /**
     * Register injection by key
     * @param {string} key
     * @param {IInjection} Dependency
     */
    public set(key: string, Dependency: new () => IInjection) {
        if (this.dependencies[key]) {
            throw new Error(`Injectable with key ${key} already set`);
        }

        this.dependencies[key] = new Dependency();
        this.dependencies[key].initialise(this);
    }

    /**
     * Retrieve injection by its class or key
     * @param {IInjection | string} Dependency
     * @returns {any}
     */
    public get(Dependency: new () => IInjection | string): any {
        if (typeof Dependency === 'string') {
            if (!this.dependencies[Dependency]) {
                throw new Error(`Injectable with key ${Dependency} not registered`);
            }
            return this.dependencies[Dependency];
        }

        const dependencyKey = Dependency.name;
        if (this.dependencies[dependencyKey]) {
            return this.dependencies[dependencyKey];
        }
        this.dependencies[dependencyKey] = new Dependency() as IInjection;

        return this.dependencies[dependencyKey];
    }
}
