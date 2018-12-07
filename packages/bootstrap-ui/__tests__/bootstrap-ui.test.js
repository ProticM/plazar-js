'use strict';

import bootstrapUi from '../src';

describe('bootstrap-ui', () => {
    it('should have init function', () => {
        expect(bootstrapUi.init).toBeDefined();
    });
});
