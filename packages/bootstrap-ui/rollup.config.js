// TODO: Create common rollup config
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import path from 'path';

const pck = require('./package.json');
const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist');

export default [
	{
		input: path.resolve(src, 'index.js'),
		output: {
			name: pck.rollupName,
			file: path.resolve(dist, (pck.rollupFileName + '.js')),
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
	}
];