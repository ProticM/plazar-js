import commonRollup from '../../scripts/rollup-common.config';
import path from 'path';
import pck from './package.json';

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist');
const config = Object.assign({}, commonRollup.config);

config.input = path.resolve(src, 'index.js');
config.output.name = pck.rollupName;
config.output.banner = commonRollup.buildBanner(pck);
config.output.file = path.resolve(dist, (pck.rollupFileName + '.js'));
config.external = ['jquery', '@plazarjs/core'];
config.output.globals = {
    'jquery': '$',
    '@plazarjs/core': 'pz'
};
export default config;