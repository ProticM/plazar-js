'use strict';

import pz from '../../src';

describe('components', () => {
    let componentDef, component, componentReconfigured,
        childComponentDef;

    beforeAll(() => {
        componentDef = pz.define('test-component', {
            ownerType: 'component',
            renderTo: 'body',
            template: '<div>{message}</div>',
            viewModel: {
                message: 'foo'
            }
        });

        childComponentDef = pz.define('child-component', {
            ownerType: 'component',
            template: '<span>{message}</span>',
            viewModel: {
                message: 'Child foo!'
            }
        });

        component = componentDef.create();
        componentReconfigured = componentDef.create({
            viewModel: {
                message: 'bar'
            }
        });
    });

    it('should have $type, create and extend defined', () => {
        expect(componentDef.$type).toBeDefined();
        expect(componentDef.$type).toBe('test-component');
        expect(componentDef.create).toBeDefined();
        expect(componentDef.extend).toBeDefined();
    });

    it('should have life cycle methods defined', () => {
        expect(component.load).toBeDefined();
        expect(component.render).toBeDefined();
        expect(component.init).toBeDefined();
        expect(component.destroy).toBeDefined();
    });

    it('should load and initialize the component', () => {
        expect(component.isComponentInstance).toBe(true);

        component.load();

        expect(component.initialized).toBe(true);
        expect(component.html).toBeDefined();
        expect(component.html.innerHTML).toBe('foo');

        component.viewModel.message = 'bar';
        expect(component.html.innerHTML).toBe('bar');
    });

    it('should add/locate a child component', () => {
        expect(component.isComponentInstance).toBe(true);
        expect(component.addChild).toBeDefined();
        expect(component.traceDown).toBeDefined();

        component.load();
        let childComponent = component.addChild(childComponentDef);

        expect(childComponent).toBeDefined();
        expect(childComponent.isComponentInstance).toBe(true);
        expect(childComponent.initialized).toBe(true);
        expect(childComponent.html).toBeDefined();
        expect(childComponent.html.innerHTML).toBe('Child foo!');

        expect(childComponent.traceUp).toBeDefined();
        expect(childComponent.parentComponent).toBeDefined();
        expect(childComponent.parentComponent.type).toBe('test-component');
        expect(childComponent.traceUp().id).toBe(component.id);

        expect(component.components.length).toBe(1);
        expect(component.components[0].id).toBe(childComponent.id);
        expect(component.components[0].type).toBe('child-component');
        expect(component.traceDown('child-component').id).toBe(childComponent.id);
    });

    it('should re-configure the component', () => {
        expect(componentReconfigured.isComponentInstance).toBe(true);
        expect(componentReconfigured.type).toBe(component.type);

        componentReconfigured.load();

        expect(componentReconfigured.initialized).toBe(true);
        expect(componentReconfigured.html).toBeDefined();
        expect(componentReconfigured.html.innerHTML).toBe('bar');
    });
});
