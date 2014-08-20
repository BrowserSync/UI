/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var socket    = require("../socket");
var multiline = require("multiline");

var template = multiline(function(){/*
 <ul class="nav">
    <li ng-repeat="(key, value) in items">
        <input type="checkbox" ng-model="value" ng-click="toggle(key, value)"> {{key}} ({{value}})
    </li>
    <li><br></li>
    <li><b>Forms:</b></li>
     <li ng-repeat="item in formItems">
        <input type="checkbox" ng-model="item.value" ng-click="formToggle(item)"> {{item.name}} ({{item.value}})
     </li>
 </ul>
 */});

/**
 * Option list
 */
app.directive("optionList", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        template: template,
        link: function ($scope) {

            var ghostMode = $scope.options.ghostMode;

            $scope.items     = {};
            $scope.formItems = [];

            for (var item in ghostMode) {
                if (item !== "forms") {
                    $scope.items[item] = ghostMode[item];
                }
            }

            for (item in ghostMode.forms) {
                $scope.formItems.push({
                    name: item,
                    key: "forms."+item,
                    value: ghostMode.forms[item]
                })
            }

            /**
             * Toggle Options
             * @param key
             * @param value
             */
            $scope.toggle = function (key, value) {
                var newValue = !value;
                socket.emit("cp:option:set", {key: prefixOption(key), value: newValue});
            }

            /**
             * Toggle Options
             * @param key
             * @param value
             */
            $scope.formToggle = function (item) {
                var newValue = !item.value;
                socket.emit("cp:option:set", {key: prefixOption(item.key), value: newValue});
            }

            function prefixOption(key) {
                return "ghostMode." + key;
            }
        }
    };
});
