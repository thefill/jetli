import {interject} from './interject.service';

describe('Interject service', () => {
    it('should be created', () => {
        expect(typeof interject).not.toEqual('function');
    });
});
