'use strict';

import pz from '../../src';

describe('components', () => {
    it('should have $type defined', () => {
        const componentDefinition = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<div>{message}</div>',
            viewModel: {
                message: 'foo'
            }
        });
    
        expect(componentDefinition.$type).toBeDefined();
        expect(componentDefinition.$type).toBe('test-component');
    })
});
