var path     = require("path");
var url      = require("url");
var http     = require("http");
var through2 = require("through2");

/**
 * @param localUrl
 * @param urlPath
 * @returns {*}
 */
function createUrl(localUrl, urlPath) {
    return url.parse(url.resolve(localUrl, urlPath));
}

/**
 * @param url
 * @param cb
 */
function verifyUrl(url, cb) {

    //var opts = require("url").parse(url);
    //console.log(opts);

    url.headers = {
        "accept": "text/html"
    };

    http.get(url, function (res) {

        if (res.statusCode === 200) {
            cb(null, res);
        } else {
            cb("not 200");
        }
    });
}

module.exports.createUrl = createUrl;
module.exports.verifyUrl = verifyUrl;
