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

        for (var item in ghostMode) {
            if (item !== "forms" && item !== "location") {
                $scope.syncItems.push({
                    value: ghostMode[item],
                    name: item,
                    title: ucfirst(item),
                    tagline: taglines[item]
                });
            }
        }

        for (item in ghostMode.forms) {
            $scope.formItems.push({
                name: item,
                title: ucfirst(item),
                key: "forms." + item,
                value: ghostMode.forms[item],
                tagline: taglines[item]
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
    function syncOptionsController($scope, Socket, contentSections) {
        $scope.section = contentSections[SECTION_NAME];
    }

    function ucfirst (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

})(angular);
