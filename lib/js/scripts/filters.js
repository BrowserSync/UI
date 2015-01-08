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
    return function(path, port) {
        return ["//", window.location.hostname, ":", port, path].join("");
    };
});

module.directive("markable", function () {
    return {
        scope: {},
        restrict: "A",
        link: function (scope, elem, attrs) {
            //var click = function (evt) {
            //    elem.toggleClass("active");
            //};
            //elem.on("click", click);
            //scope.$on('$destroy', function () {
            //    elem.off('click', click);
            //});
        }
    };
});