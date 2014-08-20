/**
 * @type {angular}
 */
var app    = require("../module");

/**
 * URL info header
 */
app.directive("urlInfo", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        template: "<h1><small>{{type}} running at: </small><a href=\"{{url}}\" target='_blank'>{{url}}</a></h1>",
        controller: function ($scope) {
            $scope.url  = $scope.options.urls.local;
            $scope.type = $scope.options.server ? "Server" : "Proxy";
        }
    };
});