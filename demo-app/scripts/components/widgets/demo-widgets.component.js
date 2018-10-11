plz.define('widgets-component', {
    ownerType: 'base-component',
    mixins: ['page-mixin'],
    template: '<div class="panel"><p class="panel-heading">' + 
        'Example widgets are built in purpose of this demo. Hopefully this project will grow and we will build set of controls to be supported out of the box.</p>' +
        '<div class="panel-block"></div>' +
        '</div>',
    renderTo: 'section.app-body'
});