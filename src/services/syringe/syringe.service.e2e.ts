import {syringe} from './syringe.service';

describe('Syringe service', () => {
    it('should be created', () => {
        expect(typeof syringe).not.toEqual('function');
    });
});
