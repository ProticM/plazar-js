'use strict';

import pz from '../../src';

describe('interpolation', () => {
    let componentDef, component;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<div><span>{message}</span><span>{fnMessage}</span></div>',
            autoLoad: true,
            viewModel: {
                fnMessage: function() {
                    return 'foo from fn'
                },
                message: 'foo'
            }
        });
        component = componentDef.create();
    });

    it('should check if span text is replaced', () => {
        expect(component.html.innerHTML).toBe('<span>foo</span><span>foo from fn</span>');
        component.viewModel.message = 'bar';
        expect(component.html.innerHTML).toBe('<span>bar</span><span>foo from fn</span>');
    });
});