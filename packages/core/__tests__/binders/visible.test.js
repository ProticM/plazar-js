'use strict';

import pz from '../../src';

describe('visible binder', () => {
    let componentDef, component;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<div><span data-visible="ok">{message}</span></div>',
            autoLoad: true,
            viewModel: {
                ok: true,
                message: 'foo'
            }
        });
        component = componentDef.create();
    });

    it('should check if span is visible', () => {
        expect(component.html.innerHTML).toBe('<span>foo</span>');
        component.viewModel.ok = false;
        expect(component.html.innerHTML).toBe('<span style=\"display: none;\">foo</span>');
    });
});