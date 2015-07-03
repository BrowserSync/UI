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

                    ctrl.update = function (data) {
                        ctrl.plugin.opts = data.opts;
                        $scope.$digest();
                    };

                    Socket.on("options:update", ctrl.update);

                    $scope.$on("$destory", function () {
                        Socket.off("options:update", ctrl.update);
                    });
                }],
                controllerAs: "ctrl"
            };
        });

})(angular);

