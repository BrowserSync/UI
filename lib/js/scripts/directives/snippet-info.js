/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");

/**
 * Snippet info
 */
app.directive("snippetInfo", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        replace: true,
        templateUrl: "js/templates/url-info.html",
        controller: function ($scope) {

            $scope.ui = {
                snippet: false
            };

            /**
             *
             */
            $scope.toggleSnippet = function () {
                $scope.ui.snippet = !$scope.ui.snippet;
            };
        }
    };
});