var module = require("./module"); //jshint ignore:line

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
    return function(path, port, mode) {
        if (mode === "snippet") {
            return path;
        }
        return ["//", window.location.hostname, ":", port, path].join("");
    };
});

module.filter("orderObjectBy", function() {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});

module.directive("icon", function () {
    return {
        scope: {
            name: "@"
        },
        restrict: "E",
        template: "<svg bs-svg-icon><use xlink:href=\"{{name}}\"></use></svg>"
    };
});