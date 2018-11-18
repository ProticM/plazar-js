let corePkg = require('../packages/core/package.json');

const core = {
    '###namespace###': 'pz',
    '###version###': corePkg.version,
    '###author###': corePkg.author,
    '###license###': corePkg.license,
    '###content###': null
};

const bootstrap = Object.assign({
    '###moduleNamespace###': 'pzBootstrap',
    '###moduleName###': 'bootstrap ui'
}, core);

module.exports = {
    core: core,
    bootstrap: bootstrap
};