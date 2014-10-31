/**
 *
 */
(function (angular) {

    var SECTION_NAME = "sync-options";

    angular.module("BrowserSync")
        .controller("SyncOptionsController",
            ["$scope", "Socket", "contentSections", syncOptionsController])

        .directive("syncOptions", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "sync-options-list.html",
                controller: ["$scope", "Socket", "contentSections", syncOptionsDirective]
            };
        });

    /**
     * @param $scope
     * @param Socket
     * @param contentSections
     */
    function syncOptionsDirective($scope, Socket, contentSections) {

        var ghostMode = $scope.options.ghostMode;

        $scope.syncItems = {};
        $scope.formItems = [];

        for (var item in ghostMode) {
            if (item !== "forms" && item !== "location") {
                $scope.syncItems[item] = ghostMode[item];
            }
        }

        for (item in ghostMode.forms) {
            $scope.formItems.push({
                name: item,
                key: "forms." + item,
                value: ghostMode.forms[item]
            })
        }

        /**
         * Toggle Options
         * @param key
         * @param value
         */
        $scope.toggle = function (key, value) {
            Socket.emit("cp:option:set", {key: prefixOption(key), value: value});
        };

        /**
         * Toggle Options
         */
        $scope.formToggle = function (item) {
            Socket.emit("cp:option:set", {key: prefixOption(item.key), value: item.value});
        };

        function prefixOption(key) {
            return "ghostMode." + key;
        }
    }

    /**
     * @param $scope
     * @param Socket
     * @param contentSections
     */
    function syncOptionsController($scope, Socket, contentSections) {
        $scope.section = contentSections[SECTION_NAME];
    }

})(angular);
