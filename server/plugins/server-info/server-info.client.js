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
                controller: ["$scope", "contentSections", "Location", urlInfoController]
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
        $scope.mode    = (function () {
            if (options.server) {
                return "Server"
            }
            if (options.proxy) {
                return "Proxy"
            }
            return "Snippet"
        })();
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
    function urlInfoController($scope, contentSections, Location) {

        var options = $scope.options;
        var urls = options.urls;

        $scope.ui = {
            server: false,
            proxy: false
        };

        if ($scope.options.mode === "Server") {
            $scope.ui.server = true;
        }

        if ($scope.options.mode === "Proxy") {
            $scope.ui.proxy = true;
        }

        $scope.urls = [];

        $scope.urls.push({
            title: "Local",
            tagline: "URL for the machine you are running BrowserSync on",
            url: urls.local,
            icon: "computer_download"
        });

        if (urls.external) {
            $scope.urls.push({
                title: "External",
                tagline: "Other devices on the same wifi network",
                url: urls.external,
                icon: "wifi_3"
            });
        }

        if (urls.tunnel) {
            $scope.urls.push({
                title: "Tunnel",
                tagline: "Secure HTTPS public url",
                url: urls.tunnel,
                icon: "globe"
            });
        }
    }

})(angular);