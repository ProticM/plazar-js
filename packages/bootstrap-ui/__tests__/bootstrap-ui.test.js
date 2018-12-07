'use strict';

import bootstrapUi from '../src';

describe('bootstrap-ui', () => {
    it('should have an initialization function defined', () => {
        expect(bootstrapUi.init).toBeDefined();
    });
});
