/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var socket    = require("../socket");
var multiline = require("multiline");

var template = multiline(function(){/*
<div class="grid text--center">
    <div class="grid__item one-half">
        <form ng-submit="urlSync(urls.current)">
            <p>Send all browsers to the following:</p>
            <label for="url-sync"><small>{{urls.local}}/ </small><input type="text" name="url-sync" ng-model="urls.current"></label>
        </form>
    </div>
     <div class="grid__item one-half">
        <p>Refresh all browsers:</p>
        <button class="button button--alt" ng-click="reloadAll()">Refresh All</button>
     </div>
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
        controller: function ($scope, Socket) {

            $scope.urls = {
                local: "http://localhost:3000",
                current: ""
            };

            $scope.reloadAll = function () {
                Socket.emit("cp:browser:reload");
            }
        }
    };
});