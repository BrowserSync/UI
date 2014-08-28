/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");

/**
 * URL info header
 */
app.directive("urlInfo", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        replace: true,
        templateUrl: "js/templates/url-info.html",
        controller: function ($scope) {

            var urls = $scope.options.urls;

            $scope.type = $scope.options.server ? "Server" : "Proxy";

            $scope.urls = [];

            $scope.urls.push({
                name: "Local (your machine)",
                url: urls.local
            });

            if (urls.external) {
                $scope.urls.push({
                    name: "External (other devices on your wifi network)",
                    url: urls.external
                });
            }

            if (urls.tunnel) {
                $scope.urls.push({
                    name: "Public URL",
                    url: urls.tunnel
                });
            }
        }
    };
});