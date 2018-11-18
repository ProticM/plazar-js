let corePkg = require('../packages/core/package.json');

const base = {
    '###namespace###': 'pz',
    '###version###': corePkg.version,
    '###author###': corePkg.author,
    '###license###': corePkg.license,
    '###content###': '',
    '###moduleName###': ''
};

const bootstrap = Object.assign(Object.assign({}, base), {
    '###moduleNamespace###': 'pzBootstrap',
    '###moduleName###': 'bootstrap ui'
});

module.exports = {
    base: base,
    bootstrap: bootstrap
};