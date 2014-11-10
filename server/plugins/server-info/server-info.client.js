/**
 * Server information plugin
 */
(function (angular) {

    angular.module("BrowserSync")
        .controller("ServerController",
            ["$scope", "contentSections", serverInfoController])

        .directive("urlInfo", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                replace: true,
                templateUrl: "url-info.html",
                controller: ["$scope", "contentSections", urlInfoController]
            };
        })

        .directive("serverInfo", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                replace: true,
                templateUrl: "server-info.html",
                controller: ["$scope", "contentSections", serverInfoController]
            };
        })

        .directive("snippetInfo", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                replace: true,
                templateUrl: "snippet-info.html",
                controller: ["$scope", snippetInfoController]
            };
        });

    /**
     * @param $scope
     * @param contentSections
     */
    function serverInfoController ($scope, contentSections) {

        /**
         * @type {{active: *, snippet: boolean}}
         */
        $scope.ui = {
            snippet: $scope.options.mode === "Snippet"
        };

        /**
         * Watch the running mode for changes
         */
        $scope.$watch("options.mode", function (data) {
            $scope.ui.snippet = data === "Snippet";
        });
    }

    /**
     * @param $scope
     */
    function snippetInfoController($scope) {/*noop*/}

    /**
     * @param $scope
     * @param contentSections
     */
    function urlInfoController($scope, contentSections) {

        var urls = $scope.options.urls;

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