'use strict';

import pz from '../../src';

describe('attr binder', () => {
    let componentDef, component;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<a data-attr-href="url" data-attr-[data-id]="id"></a>',
            autoLoad: true,
            viewModel: {
                url: 'https://www.plazarjs.com',
                id: 'my-link'
            }
        });
        component = componentDef.create();
    });

    it('should check the attribute value', () => {
        expect(component.html.getAttribute('href')).toBe('https://www.plazarjs.com');
        expect(component.html.getAttribute('data-id')).toBe('my-link');
    });
});