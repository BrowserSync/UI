/**
 * Server information plugin
 */
(function (angular) {

    const SECTION_NAME = "server-info";
    var module         = angular.module("BrowserSync");

    module.controller("ServerInfoController", [
        "$scope",
        "options",
        "contentSections",
        function serverInfoController ($scope, options, contentSections) {
            $scope.section = contentSections[SECTION_NAME];
            $scope.options = options;
            $scope.ui = {
                snippet: !options.server && !options.proxy
            };
        }
    ]);

    /**
     * Url Info - this handles rendering of each server
     * info item
     */
    module.directive("urlInfo", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                "options": "="
            },
            templateUrl: "url-info.html",
            controller: [
                "$scope",
                "$rootScope",
                "Clients",
                urlInfoController
            ]
        };
    });

    /**
     * @param $scope
     * @param $rootScope
     * @param Clients
     */
    function urlInfoController($scope, $rootScope, Clients) {

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
            icon: "imac"
        });

        if (urls.external) {
            $scope.urls.push({
                title: "External",
                tagline: "Other devices on the same wifi network",
                url: urls.external,
                icon: "wifi"
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

        /**
         *
         */
        $scope.sendAllTo = function (path) {
            Clients.sendAllTo(path);
            $rootScope.$emit("notify:flash", {
                heading: "Instruction sent:",
                message: "Sync all Browsers to: " + path
            });
        };
    }

    /**
     * Display the snippet when in snippet mode
     */
    module.directive("snippetInfo", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                "options": "="
            },
            templateUrl: "snippet-info.html",
            controller: ["$scope", function snippetInfoController($scope) {/*noop*/}]
        };
    });

})(angular);