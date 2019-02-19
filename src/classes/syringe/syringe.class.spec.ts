//
// public set<T = any>(
//     key: string,
//     Dependency: new () => IInjection | T,
//     initialiseOnRequest = false,
//         ...args
// ): void {
// public get<T = any>(Dependency: (
//      new () => IInjection | T) | string,
// ...args
// ): T {
//

// Create injection constructor mock
import {Syringe} from './syringe.class';

const injectionMock = {
    init: jest.fn()
};
const injectionConstructorMock = jest.fn().mockImplementation(() => {
    return injectionMock;
});

// Create class constructor mock
const classConstructorMock = jest.fn().mockImplementation(() => {
    return {};
});

// Create function mock
const functionMock = jest.fn();

const primitiveTypes = {
    number: 123,
    string: 'abc',
    array: [1, 2, 3],
    object: {a: 1, b: 2},
};

const constructorTypes = {
    class: classConstructorMock,
    injection: injectionConstructorMock,
    function: functionMock
};

describe('Syringe class', () => {
    let syringe: Syringe;

    beforeEach(() => {
        syringe = new Syringe();
    });

    describe('should allow to set any type of dependency', () => {
        Object.keys(primitiveTypes).forEach((typeName) => {
            it(typeName, () => {
                const value = primitiveTypes[typeName];
                syringe.set(typeName, value);
                const retrievedValue = syringe.get(typeName);
                expect(retrievedValue).toEqual(value);
            });
        });
        Object.keys(constructorTypes).forEach((typeName) => {
            it(typeName, () => {
                const value = constructorTypes[typeName];
                syringe.set(typeName, value);
                const retrievedValue = syringe.get(typeName);
                expect(retrievedValue).not.toEqual(value);
            });
        });
    });

    xdescribe('should initialise constructor during set', () => {
        Object.keys(primitiveTypes).forEach((typeName) => {
            it(typeName, () => {
                const value = primitiveTypes[typeName];
                expect(1).toBeTruthy();
            });
        });
    });

    xdescribe('should initialise during set with correct attributes', () => {
        Object.keys(primitiveTypes).forEach((typeName) => {
            it(typeName, () => {
                const value = primitiveTypes[typeName];
                expect(1).toBeTruthy();
            });
        });
    });

    xdescribe('should provide dependency', () => {
        it('by string', () => {
            expect(1).toBeTruthy();
        });
        it('by class', () => {
            expect(1).toBeTruthy();
        });
    });

    xdescribe('should provide initialised dependency', () => {
        it('by string', () => {
            expect(1).toBeTruthy();
        });
        it('by class', () => {
            expect(1).toBeTruthy();
        });
    });

    xdescribe('should initialise dependency once', () => {
        it('by string', () => {
            expect(1).toBeTruthy();
        });
        it('by class', () => {
            expect(1).toBeTruthy();
        });
    });

    xdescribe('should initialise dependency with correct arguments', () => {
        it('by string', () => {
            expect(1).toBeTruthy();
        });
        it('by class', () => {
            expect(1).toBeTruthy();
        });
    });
});
