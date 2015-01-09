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

module.directive("markable", function () {
    return {
        scope: {},
        restrict: "A",
        link: function () {
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