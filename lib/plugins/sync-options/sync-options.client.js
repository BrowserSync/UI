(function (angular) {

    const SECTION_NAME = "sync-options";

    angular
        .module("BrowserSync")
        .controller("SyncOptionsController", [
            "Socket",
            "options",
            "pagesConfig",
            SyncOptionsController
        ]);

    /**
     * @param Socket
     * @param options
     * @param pagesConfig
     * @constructor
     */
    function SyncOptionsController(Socket, options, pagesConfig) {

        var ctrl = this;
        ctrl.options = options.bs;
        ctrl.section = pagesConfig[SECTION_NAME];

        ctrl.setMany = function (value) {
            Socket.emit("ui:option:setMany", value);
            ctrl.syncItems = ctrl.syncItems.map(function (item) {
                item.value = value;
                return item;
            });
        };

        ctrl.syncItems = [];

        var taglines = {
            clicks:  "Mirror clicks across devices",
            scroll:  "Mirror scroll position across devices",
            "ghostMode.submit":  "Form Submissions will be synced",
            "ghostMode.inputs":  "Text inputs (including text-areas) will be synced",
            "ghostMode.toggles": "Radio + Checkboxes changes will be synced",
            codeSync:            "Reload the browser or inject CSS when watched files change"
        };

        // If watching files, add the code-sync toggle
        if (hasWatchers(ctrl.options.files)) {
            ctrl.syncItems.push(addItem("codeSync", ["codeSync"], ctrl.options.codeSync, taglines["codeSync"]));
        }

        Object.keys(ctrl.options.ghostMode).forEach(function (item) {
            if (item !== "forms" && item !== "location") {
                ctrl.syncItems.push(addItem(item, ["ghostMode", item], ctrl.options.ghostMode[item], taglines[item]));
            }
        });

        Object.keys(ctrl.options.ghostMode.forms).forEach(function (item) {
            ctrl.syncItems.push(addItem("Forms: " + item, ["ghostMode", "forms", item], ctrl.options.ghostMode["forms"][item], taglines["ghostMode." + item]));
        });

        function addItem (item, path, value, tagline) {
            return {
                value: value,
                name: item,
                path: path,
                title: ucfirst(item),
                tagline: tagline
            };
        }

        function hasWatchers (files) {
            if (!files) {
                return false;
            }
            return Object.keys(files).some(function (key) {
                return files[key].length;
            });
        }
    }

    angular
        .module("BrowserSync")
        .directive("syncOptions", function () {
            return {
                restrict: "E",
                scope: {
                    options: "=",
                    "syncItems": "="
                },
                templateUrl: "sync-options-list.html",
                controller: ["$scope", "Socket", "pagesConfig", syncOptionsDirective]
            };
        });

    /**
     * @param $scope
     * @param Socket
     */
    function syncOptionsDirective($scope, Socket) {

        $scope.urls = {
            local: $scope.options.urls.local,
            current: $scope.options.urls.local + "/"
        };

        /**
         * Toggle Options
         * @param item
         */
        $scope.toggle = function (item) {
            Socket.emit("ui:option:set", {
                path:  item.path,
                value: item.value
            });
        };
    }

    function ucfirst (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

})(angular);
