import {IInjection} from '../../interfaces/injection';
// Create injection constructor mock
import {Jetli} from './jetli.class';
import Mock = jest.Mock;

// Create injection constructor mock
const uninitialisedInjectionMock: IInjection = {
    initialised: false,
    init: jest.fn(() => {
        return Promise.resolve();
    })
};

class UninitialisedInjectionConstructorMock {
    constructor() {
        return uninitialisedInjectionMock;
    }
}

const initialisedInjectionMock: IInjection = {
    initialised: true,
    init: jest.fn(() => {
        return Promise.resolve();
    })
};

// tslint:disable-next-line
class InitialisedInjectionConstructorMock {
    constructor() {
        return initialisedInjectionMock;
    }
}

// Create class constructor mock
const classObject = {a: 1};

// tslint:disable-next-line
class ClassConstructorMock {
    constructor() {
        return classObject;
    }
}

// Create function mock
const functionValue = {b: 1};
// tslint:disable-next-line
const functionMock = function () {
    return functionValue;
};

const primitiveTypes: { [key: string]: number | string | any[] | object } = {
    number: 123,
    string: 'abc',
    array: [1, 2, 3],
    object: {a: 1, b: 2}
};

const constructorTypes: { [key: string]: ((...args: any) => any) | any } = {
    'class': ClassConstructorMock,
    'uninitialised injection': UninitialisedInjectionConstructorMock,
    'initialised injection': InitialisedInjectionConstructorMock,
    'function': functionMock
};

// Stubbed constructors used in later tests when we need to spy execution
const stubbedConstructorTypes = {
    class: jest.fn(),
    injection: jest.fn(),
    function: jest.fn()
};

// What should constructor return
const constructorTypeDerivatives = {
    'class': classObject,
    'uninitialised injection': uninitialisedInjectionMock,
    'initialised injection': initialisedInjectionMock,
    'function': functionValue
};

const undefinedDependencies = {
    // tslint:disable-next-line
    'null': null,
    // tslint:disable-next-line
    'undefined': undefined
};

const invalidDependencyIdentificators = {
    // tslint:disable-next-line
    'null': null,
    // tslint:disable-next-line
    'undefined': undefined,
    // tslint:disable-next-line
    'number': 123,
    // tslint:disable-next-line
    'array': [],
    // tslint:disable-next-line
    'arrow function': () => {
    }
};

describe('Jetli class', () => {
    let jetli: Jetli;

    beforeEach(() => {
        jetli = new Jetli();
        stubbedConstructorTypes.class.mockReset();
        stubbedConstructorTypes.injection.mockReset();
        stubbedConstructorTypes.function.mockReset();
    });

    describe('should allow to set any type of dependency via set method', () => {
        Object.keys(primitiveTypes).forEach((typeName) => {
            it(typeName, async () => {
                const dependency = primitiveTypes[typeName];
                await jetli.set(typeName, dependency);
                const retrievedDependency = await jetli.get(typeName);

                expect(retrievedDependency).toEqual(dependency);
            });
        });
        Object.keys(constructorTypes).forEach((typeName) => {
            it(typeName, async () => {
                const dependency = constructorTypes[typeName];
                await jetli.set(typeName, dependency);
                const retrievedDependency = await jetli.get(typeName);
                const expectedDerivative = constructorTypeDerivatives[typeName];

                expect(retrievedDependency).not.toEqual(dependency);
                expect(retrievedDependency).toEqual(expectedDerivative);
            });
        });
    });

    describe('should throw error for multiple dependency registrations via set method', () => {
        Object.keys(primitiveTypes).forEach((typeName) => {
            it(typeName, async () => {
                const dependency = primitiveTypes[typeName];
                await jetli.set(typeName, dependency);

                try {
                    await jetli.set(typeName, dependency);
                } catch (error) {
                    expect(error).toBeTruthy();
                }
            });
        });
        Object.keys(constructorTypes).forEach((typeName) => {
            it(typeName, async () => {
                const dependency = constructorTypes[typeName];
                await jetli.set(typeName, dependency);

                try {
                    await jetli.set(typeName, dependency);
                } catch (error) {
                    expect(error).toBeTruthy();
                }
            });
        });
    });

    describe('should not initialise constructor by default via set method', () => {
        Object.keys(stubbedConstructorTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const dependency: Mock = stubbedConstructorTypes[typeName];
                await jetli.set(typeName, dependency);

                expect(dependency).not.toBeCalled();
            });
        });
    });

    describe('should initialise constructor via set method', () => {
        Object.keys(stubbedConstructorTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const dependency: Mock = stubbedConstructorTypes[typeName];
                await jetli.set(typeName, dependency, false);

                expect(dependency).toBeCalledTimes(1);
            });
        });
    });

    describe('should initialise constructor once via set method', () => {
        Object.keys(stubbedConstructorTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const dependency: Mock = stubbedConstructorTypes[typeName];
                await jetli.set(typeName, dependency, false);
                await jetli.get(typeName);
                await jetli.get(typeName);
                await jetli.get(typeName);

                expect(dependency).toBeCalledTimes(1);
            });
        });
    });

    describe('should initialise constructor with correct arguments via set method', () => {
        Object.keys(stubbedConstructorTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const argument1 = 'abc';
                const argument2 = 123;
                const argument3 = [1, 2, 3];
                const dependency: Mock = stubbedConstructorTypes[typeName];
                await jetli.set(typeName, dependency, false, argument1, argument2, argument3);

                expect(dependency).toBeCalledWith(argument1, argument2, argument3);
            });
        });
    });

    it('should prevent circular dependency when classes inject via init method', async () => {
        // tslint:disable-next-line
        class ServiceA implements IInjection {
            protected service: ServiceB;
            protected id: number;

            public async init(jetliInstance) {
                this.service = await jetliInstance.get(ServiceB);
                this.id = this.service.getNumber();

                return Promise.resolve();
            }

            public getNumber() {
                return 123;
            }

            public getId() {
                return this.id;
            }
        }

        // tslint:disable-next-line
        class ServiceB implements IInjection {
            protected service: ServiceA;
            protected id: number;

            public async init(jetliInstance) {
                this.service = await jetliInstance.get(ServiceA);
                this.id = this.service.getNumber();

                return Promise.resolve();
            }

            public getNumber() {
                return 321;
            }

            public getId() {
                return this.id;
            }
        }

        const serviceA = await jetli.get(ServiceA);
        const serviceB = await jetli.get(ServiceB);

        expect(serviceA.getId()).toEqual(serviceB.getNumber());
        expect(serviceB.getId()).toEqual(serviceA.getNumber());
    });

    it('should execute init method if method exists', async () => {
        // tslint:disable-next-line
        class ServiceA implements IInjection {
            public initialised = false;
            public id = 123;

            public init = jest.fn(() => {
                this.id = 456;

                return Promise.resolve();
            });
        }

        const serviceA = await jetli.get(ServiceA);

        expect(serviceA.init).toHaveBeenCalledTimes(1);
        expect(serviceA.init).toHaveBeenCalledWith(jetli);
        expect(serviceA.id).toEqual(456);
    });

    it('should not execute init method if method exists but already initialised', async () => {
        // tslint:disable-next-line
        class ServiceA implements IInjection {
            public initialised = true;
            public id = 123;

            public init = jest.fn(() => {
                this.id = 456;

                return Promise.resolve();
            });
        }

        const serviceA = await jetli.get(ServiceA);

        expect(serviceA.init).not.toBeCalled();
        expect(serviceA.id).toEqual(123);
    });

    it('should execute init method if method exists and initialisation property not defined', async () => {
        // tslint:disable-next-line
        class ServiceA implements IInjection {
            public id = 123;

            public init = jest.fn(() => {
                this.id = 456;

                return Promise.resolve();
            });
        }

        const serviceA = await jetli.get(ServiceA);

        expect(serviceA.init).toHaveBeenCalledTimes(1);
        expect(serviceA.init).toHaveBeenCalledWith(jetli);
        expect(serviceA.id).toEqual(456);
    });

    describe('should allow to retrieve dependency with string key via get method', () => {
        Object.keys(primitiveTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const dependency = primitiveTypes[typeName];
                await jetli.set(typeName, dependency);
                const retrievedDependency = await jetli.get(typeName);

                expect(retrievedDependency).toEqual(dependency);
            });
        });
        Object.keys(constructorTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const dependency = constructorTypes[typeName];
                await jetli.set(typeName, dependency);
                const retrievedDependency = await jetli.get(typeName);
                const expectedDerivative = constructorTypeDerivatives[typeName];

                expect(retrievedDependency).not.toEqual(dependency);
                expect(retrievedDependency).toEqual(expectedDerivative);
            });
        });
    });

    describe('should allow to retrieve dependency with constructor via get method', () => {
        Object.keys(constructorTypes).forEach((typeName) => {
            it(`for ${typeName}`, async () => {
                const dependency = constructorTypes[typeName];
                const retrievedDependency = await jetli.get(dependency);
                const expectedDerivative = constructorTypeDerivatives[typeName];

                expect(retrievedDependency).not.toEqual(dependency);
                expect(retrievedDependency).toEqual(expectedDerivative);
            });
        });
    });

    describe('should unset dependency', () => {
        Object.keys(constructorTypes).forEach((typeName) => {
            describe(`for string key`, () => {
                it(`for ${typeName}`, async () => {
                    const dependency = constructorTypes[typeName];
                    await jetli.set(typeName, dependency);
                    jetli.unset(typeName);

                    try {
                        await jetli.get(typeName);
                    } catch (error) {
                        expect(error).toBeTruthy();
                    }
                });
            });
        });
    });

    describe('should throw error when init method fails for injectable', () => {

        describe('when initialisation set as immediate', () => {

            it('for set method', async () => {
                // tslint:disable-next-line
                class ServiceA implements IInjection {
                    public initialised = false;

                    public init = jest.fn(() => {
                        return Promise.reject();
                    });
                }

                try {
                    await jetli.set('some-id', ServiceA, false);
                } catch (error) {
                    expect(error).toBeTruthy();
                }
            });

            it('for get method', async () => {
                // tslint:disable-next-line
                class ServiceA implements IInjection {
                    public initialised = false;

                    public init = jest.fn(() => {
                        return Promise.reject();
                    });
                }

                try {
                    const serviceA = await jetli.get(ServiceA);
                } catch (error) {
                    expect(error).toBeTruthy();
                }
            });

        });

        it('when initialisation delayed till request', async () => {
            // tslint:disable-next-line
            class ServiceA implements IInjection {
                public initialised = false;

                public init = jest.fn(() => {
                    return Promise.reject();
                });
            }

            try {
                await jetli.set('some-id', ServiceA);
            } catch (error) {
                expect(error).toBeFalsy();
            }

            try {
                const serviceA = await jetli.get('some-id');
            } catch (error) {
                expect(error).toBeTruthy();
            }
        });
    });

    describe('should throw error for requesting unset dependency via get method', () => {
        Object.keys(constructorTypes).forEach((typeName) => {
            describe(`for string key`, () => {
                it(`for ${typeName}`, async () => {
                    const dependency = constructorTypes[typeName];
                    await jetli.set(typeName, dependency);
                    jetli.unset(typeName);

                    try {
                        await jetli.get(typeName);
                    } catch (error) {
                        expect(error).toBeTruthy();
                    }
                });
            });
        });
    });

    describe('should throw error for requesting unregistered dependency via get method', () => {
        describe(`for string key`, () => {
            Object.keys(constructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const dependency = constructorTypes[typeName];

                    try {
                        await jetli.get(typeName);
                    } catch (error) {
                        expect(error).toBeTruthy();
                    }
                });
            });
        });
        describe(`for constructor key`, () => {
            Object.keys(constructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const dependency = constructorTypes[typeName];

                    try {
                        await jetli.get(dependency);
                    } catch (error) {
                        expect(error).toBeTruthy();
                    }
                });
            });
        });
    });

    describe('should throw error for requesting unregistered dependency via set method', () => {
        Object.keys(undefinedDependencies).forEach((typeName) => {
            it(`for ${typeName} dependency`, async () => {
                const dependency = constructorTypes[typeName];

                try {
                    await jetli.set('someType', dependency);
                } catch (error) {
                    expect(error).toBeTruthy();
                }
            });
        });
    });

    describe('should throw error for requesting dependency with invalid identificator via get method', () => {
        Object.keys(invalidDependencyIdentificators).forEach((typeName) => {
            it(`for ${typeName} dependency`, async () => {
                const identificator = invalidDependencyIdentificators[typeName];

                try {
                    await jetli.get(identificator);
                } catch (error) {
                    expect(error).toBeTruthy();
                }
            });
        });
    });

    describe('should initialise constructor via get method', () => {
        describe('for string key', () => {
            Object.keys(stubbedConstructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const dependency: Mock = stubbedConstructorTypes[typeName];
                    await jetli.set(typeName, dependency);
                    expect(dependency).not.toBeCalled();

                    await jetli.get(typeName);
                    expect(dependency).toBeCalledTimes(1);
                });
            });
        });
        describe('for constructor key', () => {
            Object.keys(stubbedConstructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const dependency: Mock = stubbedConstructorTypes[typeName];

                    await jetli.get(dependency);
                    expect(dependency).toBeCalledTimes(1);
                });
            });
        });
    });

    describe('should initialise constructor once via get method', () => {
        describe('for string key', () => {
            Object.keys(stubbedConstructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const dependency: Mock = stubbedConstructorTypes[typeName];
                    await jetli.set(typeName, dependency);

                    await jetli.get(typeName);
                    await jetli.get(typeName);
                    await jetli.get(typeName);
                    expect(dependency).toBeCalledTimes(1);
                });
            });
        });
        describe('for constructor key', () => {
            Object.keys(stubbedConstructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const dependency: Mock = stubbedConstructorTypes[typeName];

                    await jetli.get(dependency);
                    await jetli.get(dependency);
                    await jetli.get(dependency);
                    expect(dependency).toBeCalledTimes(1);
                });
            });
        });
    });

    describe('should initialise constructor with correct arguments via get method', () => {
        describe('for string key', () => {
            Object.keys(stubbedConstructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const argument1 = 'abc';
                    const argument2 = 123;
                    const argument3 = [1, 2, 3];
                    const dependency: Mock = stubbedConstructorTypes[typeName];
                    await jetli.set(typeName, dependency, true, argument1, argument2, argument3);
                    await jetli.get(typeName);

                    expect(dependency).toBeCalledWith(argument1, argument2, argument3);
                });
            });
        });
        describe('for constructor key', () => {
            Object.keys(stubbedConstructorTypes).forEach((typeName) => {
                it(`for ${typeName}`, async () => {
                    const argument1 = 'abc';
                    const argument2 = 123;
                    const argument3 = [1, 2, 3];
                    const dependency: Mock = stubbedConstructorTypes[typeName];
                    await jetli.get(dependency, argument1, argument2, argument3);

                    expect(dependency).toBeCalledWith(argument1, argument2, argument3);
                });
            });
        });
    });

});
