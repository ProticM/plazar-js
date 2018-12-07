'use strict';

import pz from '../../src';

describe('text binder', () => {
    let componentDef, component;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<span data-text="message"></span>',
            autoLoad: true,
            viewModel: {
                message: 'foo'
            }
        });
        component = componentDef.create();
    });

    it('should check if text is foo', () => {
        expect(component.html.innerHTML).toBe('foo');
    });
});