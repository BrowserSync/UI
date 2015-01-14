/**
 * Server information plugin
 */
(function (angular) {

    angular.module("BrowserSync")
        .controller("ServerController",
            ["$scope", "options", "contentSections", serverInfoController])

        .directive("urlInfo", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "options": "="
                },
                templateUrl: "url-info.html",
                controller: ["$scope", "$rootScope", "contentSections", "Location", urlInfoController]
            };
        })

        .directive("snippetInfo", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "options": "="
                },
                templateUrl: "snippet-info.html",
                controller: ["$scope", snippetInfoController]
            };
        });

    /**
     * @param $scope
     * @param {BrowserSync.options} options
     * @param contentSections
     */
    function serverInfoController ($scope, options, contentSections) {
        $scope.options = options;
        $scope.ui = {
            snippet: !options.server && !options.proxy
        };
    }

    /**
     * @param $scope
     */
    function snippetInfoController($scope) {/*noop*/}

    /**
     * @param $scope
     * @param Location
     * @param contentSections
     */
    function urlInfoController($scope, $rootScope, contentSections, Location) {

        var options = $scope.options;
        var urls = options.urls;

        $scope.ui = {
            server: false,
            proxy: false
        };

        if ($scope.options.mode === "server") {
            $scope.ui.server = true;
        }

        if ($scope.options.mode === "proxy") {
            $scope.ui.proxy = true;
        }

        $scope.urls = [];

        $scope.urls.push({
            title: "Local",
            tagline: "URL for the machine you are running BrowserSync on",
            url: urls.local,
            icon: "#svg-imac"
        });

        if (urls.external) {
            $scope.urls.push({
                title: "External",
                tagline: "Other devices on the same wifi network",
                url: urls.external,
                icon: "#svg-wifi"
            });
        }

        if (urls.tunnel) {
            $scope.urls.push({
                title: "Tunnel",
                tagline: "Secure HTTPS public url",
                url: urls.tunnel,
                icon: "#svg-globe"
            });
        }

        /**
         *
         */
        $scope.refreshAll = function () {
            Location.refreshAll();
        };

        /**
         *
         */
        $scope.sendAllTo = function (path) {
            $rootScope.$emit("notify:flash", {
                heading: "Instruction sent:",
                message: "Sync all Browsers to: " + path
            });
            Location.sendAllTo(path);
        };
    }

})(angular);