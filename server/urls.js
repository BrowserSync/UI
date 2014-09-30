var _           = require("lodash");
var url           = require("url");

/**
 * @param {Array} paths
 * @param {Object} data
 */
module.exports.addPath = function (paths, path) {
    if (!_.find(paths, {path: path})) {
        paths.push({path: path});
        return paths;
    }
    return paths;
};

/**
 * @param {Array} paths
 * @param {Object} data
 */
module.exports.trackUrls = function (paths, data) {

    var len     = paths.length;
    var updated = exports.addPath(paths, url.parse(data.path).pathname);

    return updated;

    //
    //return updated;
    //if (updated.length !== len) {
    //    return updated;
    //}
    //
    //return false;
};