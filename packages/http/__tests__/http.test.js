'use strict';

import http from '../src';

describe('http', () => {
    it('should have an initialization function defined', () => {
        expect(http.init).toBeDefined();
    });
});
