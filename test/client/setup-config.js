/**
 *
 */
(function (angular) {
    angular.module("BrowserSync").config([
        "$routeProvider",
        "$locationProvider",
        function ($routeProvider) {
            $routeProvider.when("/sync-options", {
                templateUrl: "sync-options.html",
                controller: "SyncOptionsController"
            }).when("/", {
                templateUrl: "server-info.html",
                controller: "ServerController"
            }).when("/history", {
                templateUrl: "history.html",
                controller: "HistoryController"
            }).when("/plugins", {
                templateUrl: "plugins.html",
                controller: "PluginsController"
            })
        }
    ]).value("contentSections", {
        "sync-options": {
            path: "/sync-options",
            title: "Sync Options",
            template: "sync-options.html",
            controller: "SyncOptionsController",
            order: 2
        },
        "server-info": {
            path: "/",
            title: "Server Info",
            template: "server-info.html",
            controller: "ServerController",
            order: 1
        },
        history: {
            path: "/history",
            title: "History",
            template: "history.html",
            controller: "HistoryController",
            order: 3
        },
        plugins: {
            path: "/plugins",
            title: "Plugins",
            template: "plugins.html",
            controller: "PluginsController",
            order: 4
        }
    });
})(angular);