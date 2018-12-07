'use strict';

import pz from '../../src';

describe('ifnot binder', () => {
    let componentDef, component;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<div><span data-ifnot="ok">{message}</span></div>',
            autoLoad: true,
            viewModel: {
                ok: false,
                message: 'foo'
            }
        });
        component = componentDef.create();
    });

    it('should check if span is rendered', () => {
        expect(component.html.innerHTML).toBe('<span>foo</span>');
    });
});