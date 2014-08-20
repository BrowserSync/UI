/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var multiline = require("multiline");

var template = multiline(function(){/*
<div>
    <ul class="nav url-nav">
        <li ng-repeat="url in urls"><span>{{url.name}}</span>: <a href="{{url.url}}" target="_blank">{{url.url}}</a></li>
    </ul>
</div>
*/});

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
        template: template,
        controller: function ($scope) {

            var urls = $scope.options.urls;

            $scope.type = $scope.options.server ? "Server" : "Proxy";

            $scope.urls = [];

            $scope.urls.push({
                name: "Local (your machine)",
                url: urls.local
            });

            if (urls.external) {
                $scope.urls["External (other devices on your wifi network)"] = urls.external
                $scope.urls.push({
                    name: "External (other devices on your wifi network)",
                    url: urls.external
                });
            }
        }
    };
});