(function () {
    var base = function () {
        'use strict';

        return {
            mixins: [],
            init: function () { },
            destroy: function () {
                // TODO: multiple instances destroy
                var idx = plz.application.instances.indexOf(this);
                if (idx != -1) {
                    plz.application.instances.splice(idx, 1);
                };
            },
            applyMixins: function () {
                var me = this;
                plz.forEach(this.mixins, function (mixinName) {
                    var mixin = plz.getDefinitionOf(mixinName);
                    var cleanMixin = plz.obj.clone(mixin);
                    delete cleanMixin.ownerType;
                    plz.obj.assignTo(me, cleanMixin, false);
                });
            }
        };
    };

    base.extend = function extend(props) {
        // TODO: Inherit statics (maybe use TypeScript extend fn...but it has a possibility to run very slow!!)

        var properties = plz.toObject(props);
        var parentClass = this;

        var returnVal = (function (_parentClass, _properties) {
            var _hasCustomConstructor = _properties && _properties.constructor
                && _properties.constructor !== {}.constructor;
            var propertyNames = plz.obj.getKeys(_properties);
            var propertiesReduced = propertyNames.reduce(function (acc, key) {
                var isFunction = plz.isFunction(_properties[key]);
                acc[isFunction ? 'fnKeys' : 'attrKeys'].push(key);
                return acc;
            }, { fnKeys: [], attrKeys: [] });

            var plz_type = function () { // child class
                var me = this, result;

                plz.forEach(propertiesReduced.attrKeys, function (key) { // apply properties (strings, ints, arrays, objects...etc) to the object instance
                    if (!me.hasOwnProperty(key) && !plz.isEmpty(_properties[key], true)) {
                        var isArray = plz.isArray(_properties[key]);
                        var isObject = plz.isObject(_properties[key]);

                        me[key] = isArray ? _properties[key].slice() : (isObject ? plz.assignTo({}, plz.obj.clone(_properties[key])) : _properties[key]);
                    };
                });

                this.base = _hasCustomConstructor ? _parentClass : null;
                result = _hasCustomConstructor ? _properties.constructor.apply(this, arguments)
                    : _parentClass.apply(this, arguments);
                this.base = null;
                return result || me;
            };

            plz_type.prototype = Object.create(_parentClass.prototype);
            plz_type.prototype.constructor = plz_type;

            plz.forEach(propertiesReduced.fnKeys, function (key) {
                plz_type.prototype[key] = key == 'constructor' ? plz_type.prototype.constructor : (function (name, fn, base) { // share the functions between instances via prototype
                    return function () {
                        var tmp = this.base;
                        var addSuperCallWrapper = !plz.isEmpty(base[name]) && plz.isFunction(base[name]);
                        this.base = addSuperCallWrapper ? base[name] : function () {
                            throw new Error('Method named: [' + name + '] was not found on type: [' + this.ownerType + ']');
                        };
                        var result = fn.apply(this, arguments);
                        this.base = tmp;
                        return result;
                    };
                })(key, _properties[key], _parentClass.prototype);
            });

            plz_type.extend = extend;
            return plz_type;

        })(parentClass, properties);

        properties = null;
        parentClass = null;

        return returnVal;
    };

    plz.define('base', base);

    base = null;
})();
