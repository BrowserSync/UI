/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var multiline = require("multiline");

var template = multiline(function(){/*
<div>
    <input type="text" ng-model="urls.current">
</div>
*/});

/**
 * URL info header
 */
app.directive("urlSync", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        replace: true,
        template: template,
        controller: function ($scope) {
            $scope.urls = {
                current: ""
            }
        }
    };
});