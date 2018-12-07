'use strict';

import pz from '../src/core';

describe('core', function() {
    let obj = {}, fn = () => {}, array = [], und = undefined, 
        n = null, emptyStr = '', str = 'test';

    it('should be object', () => {
        expect(pz.isObject(obj)).toBe(true);
    });

    it('should be function', () => {
        expect(pz.isFunction(fn)).toBe(true);
    });

    it('should be array', () => {
        expect(pz.isArray(array)).toBe(true);
    });

    it('should be string', () => {
        expect(pz.isString(str)).toBe(true);
    });

    it('should be empty', () => {
        expect(pz.isEmpty(und)).toBe(true);
        expect(pz.isEmpty(n)).toBe(true);
        expect(pz.isEmpty(emptyStr)).toBe(true);
    });

    it('should not be empty', () => {
        expect(pz.isEmpty(emptyStr, true)).toBe(false);
    });
});
