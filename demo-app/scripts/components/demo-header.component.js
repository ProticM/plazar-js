plz.define('header-component', {
    ownerType: 'base-component',
    autoLoad: true,
    renderTo: 'header.main-navbar',
    template: '<nav class="navbar" role="navigation" aria-label="main navigation">' +
        '<div class="navbar-brand">' +
        '<a class="navbar-item" href="javascript:void(0)">' +
        '<img src="" width="112" height="28" style="border: 2px solid #23d160">' +
            '</a>' +
        '<a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">' +
        '<span aria-hidden="true"></span>' +
            '<span aria-hidden="true"></span>' +
            '<span aria-hidden="true"></span>' +
            '</a>' +
        '</div>' +
        '<div id="navbarBasicExample" class="navbar-menu">' +
        '<div class="navbar-start">' +
        '<a class="navbar-item">' +
            'Menu Item 1' +
                '</a>' +
            '<a class="navbar-item">' +
            'Menu Item 2' +
                '</a>' +
            '<div class="navbar-item has-dropdown is-hoverable">' +
            '<a class="navbar-link">' +
            'More' +
                '</a>' +
            '<div class="navbar-dropdown">' +
            '<a class="navbar-item">' +
                'Menu Item 3' +
                '</a>' +
                '<a class="navbar-item">' +
                'Menu Item 4' +
                    '</a>' +
                '<a class="navbar-item">' +
                'Menu Item 5' +
                    '</a>' +
                '<hr class="navbar-divider">' +
                '<a class="navbar-item">' +
                'Menu Item 6' +
                    '</a>' +
                '</div>' +
            '</div>' +
            '</div>' +
        '</div>' +
    '</nav>'
});