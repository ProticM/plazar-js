import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    config: {
        input: '',
        output: {
            name: '',
            file: '',
            format: 'umd'
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: ['node_modules/**'],
                presets: ['@babel/preset-env']
            })
        ]
    },
    buildBanner: (pck) => {
        return [
            '// PlazarJS ' + pck.rollupFileName + ' v' + pck.version,
            '// Copyright ' + pck.author + ' and other contributors',
            '// Licensed under ' + pck.license + ' (https://github.com/ProticM/plazar-js/blob/master/LICENSE)'
        ].join('\n');
    }
};