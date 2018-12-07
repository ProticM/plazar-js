const jQuery = function(selector, context) {
	return new jQuery.fn(selector, context);
};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery
};

export default jQuery;