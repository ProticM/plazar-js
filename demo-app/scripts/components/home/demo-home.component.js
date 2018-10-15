plz.define('home-component', {
    ownerType: 'base-component',
    mixins: ['page-mixin'],
    template: '<div>Welcome to PlazarJS Demo Application. This demo uses <a class="has-text-lightblue" href="https://bulma.io/" target="_blank">Bulma CSS Framework</a> ' + 
        'for styling therefore make sure that your browser supports ' +
        '<a class="has-text-lightblue" href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox" target="_blank">Flexbox</a>. Note that usage of this framework is not required and it\'\s used to simplify this demo while focusing on PlazarJS features. ' + 
        'We built this demo by using inline and pre rendered templates, but every template can be loaded asynchronously from the server while initializing component.' +
        '</div>',
    renderTo: 'section.app-body'
});