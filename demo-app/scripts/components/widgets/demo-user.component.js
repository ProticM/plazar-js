pz.define('user-component', {
    ownerType: 'base-component',
    autoLoad: true,
    template: '<div class="columns b-1 is-marginless has-background-white">' +
        '<aside class="column is-1" style="height:100px;width:100px">' +
            '<img src="images/no-image.png" style="width:100%;height:100%;border-radius: 50%!important">' +
            '<p><button class="button is-primary is-outlined is-small is-fullwidth">Settings</button></p>' +
        '</aside>' +
        '<aside class="column is-10">' +
            '<div class="panel">' +
                '<p class="has-text-weight-semibold is-size-3">John Doe</p>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>' +
            '</div>' +
        '</aside>' +
    '</div>',
    renderTo: 'root' // default renderTo, this can be overridden when adding this component as a child
});