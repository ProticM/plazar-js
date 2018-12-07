'use strict';
const $ = jest.genMockFromModule('jquery');
global.$ = global.jQuery = $;
export default $;