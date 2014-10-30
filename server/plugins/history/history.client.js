/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";

    angular.module("BrowserSync")

        .controller("HistoryController",
            ["$scope", "$rootScope", "Socket", "contentSections", historyController])

        .directive("historyList", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "history-list.html",
                controller: ["$scope", "$rootScope", "Socket", "contentSections", historyDirective]
            }
        });

    /**
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function historyController($scope, $rootScope, Socket, contentSections) {
        $scope.section = contentSections[SECTION_NAME];
    }

    /**
     * Controller for the URL sync
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function historyDirective($scope, $rootScope, Socket) {

        /**
         * @type {{loading: boolean}}
         */
        $scope.ui = {
            loading: false,
            loaders: {
                "reloadAll": false,
                "sendAllTo": false,
                "newUrl": false
            }
        };

        /**
         * @type {{local: *, current: string}}
         */
        $scope.urls = {
            local: $scope.options.urls.local,
            current: "",
            visited: $scope.options._visited
        };

        $scope.selectedUrl = null;

        /**
         * Emit the socket event
         */
        $scope.sendAllTo = function (path, trigger) {

            $scope.setLoading(trigger);
            $scope.urls.current = "";

            if (!path || path === "undefined") {
                $scope.resetLoaders();
                return;
            }

            Socket.emit("urls:browser:url", {
                path: path
            });

            window.setTimeout(function () {
                $scope.$apply(function () {
                    $rootScope.$broadcast("notify:flash", {
                        heading: "Instruction Sent:",
                        message: "Send all browsers to " + path,
                        status: "success",
                        timeout: 2000
                    });
                    $scope.resetLoaders();
                })
            }, 200);
        };

        /**
         * Emit the reload-all event
         */
        $scope.reloadAll = function () {

            $scope.setLoading("reloadAll");
            Socket.emit("urls:browser:reload");
            window.setTimeout(notify.bind(null, $scope, $rootScope), 200);
        };

        /**
         *
         */
        $scope.updateVisited = function (data) {
            $scope.$apply(function () {
                $scope.urls.visited = data;
            });
        };

        /**
         * Set the loading state
         * @param name
         */
        $scope.setLoading = function (name) {
            $scope.ui.loading       = true;
            $scope.ui.loaders[name] = true;
        };

        /**
         * Reset the loading state
         */
        $scope.resetLoaders = function () {
            $scope.ui.loading = false;
            $scope.ui.loaders.reloadAll = false;
            $scope.ui.loaders.sendAllTo = false;
            $scope.ui.loaders.newUrl    = false;
        };

        Socket.on("cp:urls:update", $scope.updateVisited);
    }

    /**
     * Let the user know shit is happening
     */
    function notify($scope, $rootScope) {

        $scope.$apply(function () {

            $scope.resetLoaders();

            $rootScope.$broadcast("notify:flash", {
                heading: "Instruction Sent:",
                message: "Reload all browsers..",
                status: "error",
                timeout: 2000
            });
        });
    }

})(angular);

