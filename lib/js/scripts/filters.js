var module = require("./module");

module.filter("ucfirst", function () {
    return function(input) {
        return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
});
module.filter("localRootUrl", function () {
    return function(port) {
        return ["//", window.location.hostname, ":", port].join("");
    };
});
module.filter("localUrl", function () {
    return function(path, port) {
        return ["//", window.location.hostname, ":", port, path].join("");
    };
});