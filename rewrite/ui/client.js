(function (angular) {

    const PLUGIN_NAME = "Rewrite Rules";

    angular
        .module("BrowserSync")
        .directive("rewriteRules", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "options": "=",
                    "pluginOpts": "="
                },
                templateUrl: "rewrite.directive.html",
                controller: ["$scope", "Socket", function ($scope, Socket) {

                    var ctrl = this;

                    ctrl.restriction = "";

                    ctrl.state = {
                        classname: "ready"
                    };

                    ctrl.plugin = $scope.options.userPlugins.filter(function (item) {
                        return item.name === PLUGIN_NAME;
                    })[0];

                    ctrl.plugin.rules = [
                        {
                            added: 1234567892,
                            active: true,
                            match: {
                                input: '/some-regex/',
                                type:  'regex'
                            },
                            replace: {
                                input: 'function (match) { return match + "other" }',
                                type:  'function'
                            }
                        },
                        {
                            added: 1234567891,
                            active: true,
                            match: {
                                input: '<script src="/assetes/whateves"></script>',
                                type:  'string'
                            },
                            replace: {
                                input: '<script src="/assetes/whateves.js"></script>',
                                type:  'string'
                            }
                        }
                    ];

                    ctrl.toggleState = function (rule) {
                        rule.active = !rule.active;
                    }

                    ctrl.update = function (data) {
                        ctrl.plugin.opts = data.opts;
                        $scope.$digest();
                    };

                    ctrl.removeRule = function (rule) {
                        Socket.on
                    }

                    Socket.on("options:update", ctrl.update);

                    $scope.$on("$destory", function () {
                        Socket.off("options:update", ctrl.update);
                    });
                }],
                controllerAs: "ctrl"
            };
        });

})(angular);

