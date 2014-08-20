/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var multiline = require("multiline");

var template = multiline(function(){/*
<div>
    <a href="" title="Show Snippet" ng-click="toggleSnippet()">Show Snippet</a>
     <div ng-show="ui.snippet">
         <p>Place this snippet somewhere before the closing <code>&lt;/body&gt;</code> tag in your website</p>
         <div class="highlight small text--left">
            <pre><code>{{options.snippet}}</code></pre>
         </div>
         <button ng-click="toggleSnippet()">Close</button>
     </div>
</div>
*/});

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
        template: template,
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