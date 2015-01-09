var Immutable  = require("immutable");
//var transforms = require("./transforms");

var defaults = Immutable.Map({
    port: 3001
});

/**
 * @param {Object} obj
 * @returns {Map}
 */
module.exports.merge = function (obj) {
    return defaults.mergeDeep(obj);
};

/**
 * @param {Immutable.Map} obj
 * @returns {*}
 */
//function transformOptions(obj) {
//
//    var out;
//
//    Object.keys(transforms).forEach(function (key) {
//        out = obj.set(key, transforms[key](obj));
//    });
//
//    return out;
//}