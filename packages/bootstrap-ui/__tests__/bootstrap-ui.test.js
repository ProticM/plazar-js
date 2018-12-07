'use strict';
jest.mock('@plazarjs/core', jest.fn);
jest.mock('$', jest.fn);

import bootstrapUi from '../src';

describe('bootstrap-ui', () => {
    it('should have an initialization function defined', () => {
        expect(bootstrapUi.init).toBeDefined();
    });
});
