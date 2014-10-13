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
         * @type {{active: *, snippet: boolean}}
         */
        $scope.ui = {
            active: contentSections["server-info"].active,
            snippet: $scope.options.mode === "Snippet"
        };

        /**
         * Watch the running mode for changes
         */
        $scope.$watch("options.mode", function (data) {
            $scope.ui.snippet = data === "Snippet";
        });

        /**
         *
         */
        $scope.$watch(function () {
            return contentSections["server-info"].active
        }, function (data) {
            $scope.ui.active = data;
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