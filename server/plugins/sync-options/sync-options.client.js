/**
 *
 */
(function (angular) {

    var SECTION_NAME = "sync-options";

    angular.module("BrowserSync")

        .controller("SyncOptionsController",
            ["$scope", "Socket", "options", "contentSections", syncOptionsController])

        .directive("syncOptions", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "sync-options-list.html",
                controller: ["$scope", "Socket", "Location", "contentSections", syncOptionsDirective]
            };
        });

    /**
     * @param $scope
     * @param Socket
     * @param contentSections
     */
    function syncOptionsDirective($scope, Socket, Location, contentSections) {

        var ghostMode = $scope.options.ghostMode;

        $scope.syncItems = [];
        $scope.formItems = [];

        $scope.urls = {
            local: $scope.options.urls.local,
            current: $scope.options.urls.local + "/"
        };

        var taglines = {
            clicks:  "Clicks will be synced",
            scroll:  "Scroll position will be synced",
            submit:  "Form Submissions will be synced",
            inputs:  "Text inputs (including text-areas) will be synced",
            toggles: "Radio + Checkboxes changes will be synced"
        };

        Object.keys(ghostMode).forEach(function (item) {
            if (item !== "forms" && item !== "location") {
                $scope.syncItems.push(addItem(item, ["ghostMode", item], ghostMode[item]));
            }
        });

        Object.keys(ghostMode.forms).forEach(function (item) {
            $scope.syncItems.push(addItem(item, ["ghostMode", "forms", item], ghostMode["forms"][item]));
        });

        function addItem (item, path, value) {
            return {
                value: value,
                name: item,
                path: path,
                title: ucfirst(item),
                tagline: taglines[item]
            }
        }

        /**
         * Toggle Options
         * @param item
         */
        $scope.toggle = function (item) {
            Socket.emit("cp:option:set", {
                path:  item.path,
                value: item.value
            });
        };

        /**
         * Emit the reload-all event
         */
        $scope.reloadAll = function () {
            Location.refreshAll();
        };

        /**
         * Emit the socket event
         */
        $scope.sendAllTo = function (path) {
            $scope.urls.current = $scope.options.urls.local + "/";
            Location.sendAllTo(path);
        };
    }

    /**
     * @param $scope
     * @param Socket
     * @param contentSections
     */
    function syncOptionsController($scope, Socket, options, contentSections) {
        $scope.options = options;
        $scope.section = contentSections[SECTION_NAME];
    }

    function ucfirst (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

})(angular);
