var _           = require("lodash");
var url         = require("url");

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
 * @param {String} path
 */
module.exports.trackUrls = function (paths, path) {
    return exports.addPath(paths, url.parse(path).path);
};