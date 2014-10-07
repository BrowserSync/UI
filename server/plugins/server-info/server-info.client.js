/**
 *
 */
(function (angular) {

    angular.module("BrowserSync")

        .directive("urlInfo", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                replace: true,
                templateUrl: "templates/url-info.html",
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
                templateUrl: "templates/server-info.html",
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
                templateUrl: "templates/snippet-info.html",
                controller: ["$scope", snippetInfoController]
            };
        });

    /**
     * @param $scope
     * @param contentSections
     */
    function serverInfoController ($scope, contentSections) {

        /**
         *
         */
        $scope.$watch(function () {
            return contentSections["server-info"].active
        }, function (data) {
            $scope.ui.active = data;
        });

        $scope.ui = {
            active: contentSections["server-info"].active
        };
    }

    /**
     * @param $scope
     */
    function snippetInfoController($scope) {

        $scope.ui = {
            snippet: false
        };

        /**
         *
         */
        $scope.toggleSnippet = function () {
            $scope.ui.snippet = !$scope.ui.snippet;
        };
    }

    /**
     * @param $scope
     * @param contentSections
     */
    function urlInfoController($scope, contentSections) {

        var urls = $scope.options.urls;

        $scope.type = $scope.options.server ? "Server" : "Proxy";

        $scope.urls = [];

        $scope.urls.push({
            name: "Local (your machine)",
            url: urls.local
        });

        if (urls.external) {
            $scope.urls.push({
                name: "External (other devices on your wifi network)",
                url: urls.external
            });
        }

        if (urls.tunnel) {
            $scope.urls.push({
                name: "Public URL",
                url: urls.tunnel
            });
        }
    }

})(angular);