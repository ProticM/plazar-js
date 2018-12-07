'use strict';

import pz from '../../src';

describe('value binder', () => {
    let componentDef, component;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<input data-value="name" />',
            autoLoad: true,
            viewModel: {
                name: 'foo'
            }
        });
        component = componentDef.create();
    });

    it('should check if value is foo', () => {
        expect(component.html.value).toBe('foo');
    });
});