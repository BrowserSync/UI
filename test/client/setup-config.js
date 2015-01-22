/**
 * This file is generated automatically at run time by the BrowserSync UI
 */
(function (angular) {
    angular.module("BrowserSync").config([
        "$routeProvider",
        "$locationProvider",
        function ($routeProvider) {
            $routeProvider.when("/sync-options", {
                templateUrl: "sync-options.html",
                controller: "SyncOptionsController",
                resolve: {
                    options: [
                        "Options",
                        function (opts) {
                            return opts.all();
                        }
                    ]
                }
            }).when("/", {
                templateUrl: "overview.html",
                controller: "OverviewController",
                resolve: {
                    options: [
                        "Options",
                        function (opts) {
                            return opts.all();
                        }
                    ]
                }
            }).when("/history", {
                templateUrl: "history.html",
                controller: "HistoryController",
                resolve: {
                    options: [
                        "Options",
                        function (opts) {
                            return opts.all();
                        }
                    ]
                }
            }).when("/remote-debug", {
                templateUrl: "remote-debug.html",
                controller: "RemoteDebugController",
                resolve: {
                    options: [
                        "Options",
                        function (opts) {
                            return opts.all();
                        }
                    ]
                }
            }).when("/help", {
                templateUrl: "help.html",
                controller: "HelpAboutController",
                resolve: {
                    options: [
                        "Options",
                        function (opts) {
                            return opts.all();
                        }
                    ]
                }
            })
        }
    ]).value("pagesConfig", {
        "sync-options": {
            path: "/sync-options",
            title: "Sync Options",
            template: "sync-options.html",
            controller: "SyncOptionsController",
            order: 2,
            icon: "sync",
            iconName: "#svg-sync"
        },
        overview: {
            path: "/",
            title: "Overview",
            template: "overview.html",
            controller: "OverviewController",
            order: 1,
            icon: "cog",
            iconName: "#svg-cog"
        },
        history: {
            path: "/history",
            title: "History",
            template: "history.html",
            controller: "HistoryController",
            order: 3,
            icon: "list2",
            iconName: "#svg-list2"
        },
        "remote-debug": {
            path: "/remote-debug",
            title: "Remote Debug",
            template: "remote-debug.html",
            controller: "RemoteDebugController",
            order: 4,
            icon: "bug",
            iconName: "#svg-bug"
        },
        help: {
            path: "/help",
            title: "Help / About",
            template: "help.html",
            controller: "HelpAboutController",
            order: 5,
            icon: "help",
            iconName: "#svg-help"
        }
    });
})(angular);