import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
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
};