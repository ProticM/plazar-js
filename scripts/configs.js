let corePkg = require('../packages/core/package.json');

const base = {
    '###namespace###': 'pz',
    '###version###': corePkg.version,
    '###author###': corePkg.author,
    '###license###': corePkg.license,
    '###content###': '',
    '###moduleName###': 'core'
};

module.exports = {
    base: base,
    forModule: function(name, namespace) {
        var ns = (namespace || name.split('-').shift());
        return Object.assign(Object.assign({}, base), {
            '###moduleNamespace###': ns,
            '###moduleName###': name
        });
    }
};