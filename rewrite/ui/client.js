(function (angular) {

    var OPT_PATH = ['shakyshane', 'rewrite-rules'];

    angular
        .module("BrowserSync")
        .directive("rewriteRules", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "options": "=",
                    "pluginOpts": "=",
                    "uiOptions": "="
                },
                templateUrl: "rewrite.directive.html",
                controller: ["$scope", "Socket", rewriteRulesDirective],
                controllerAs: "ctrl"
            };
        });

    /**
     * Rewrite Rules Directive
     * @param $scope
     * @param Socket
     */
    function rewriteRulesDirective($scope, Socket) {

        var ctrl    = this;
        var ns      = OPT_PATH.join(":");

        ctrl.plugin = $scope.options.userPlugins.filter(function (item) {
            return item.name === "Rewrite Rules";
        })[0];

        ctrl.plugin.opts = $scope.uiOptions[OPT_PATH[0]][OPT_PATH[1]];
        ctrl.rules       = ctrl.plugin.opts.rules;

        ctrl.state = {
            classname: "ready"
        };

        ctrl.toggleState = function (rule) {
            rule.active = !rule.active;
        }

        ctrl.update = function (data) {
            ctrl.plugin.opts  = data.opts;
            ctrl.rules = data.rules;
            $scope.$digest();
        };

        ctrl.updateRules = function (data) {
            ctrl.rules = data.rules;
            $scope.$digest();
        };

        ctrl.removeRule = function (action, rule) {
            Socket.uiEvent({
                namespace: ns,
                event: 'removeRule',
                data: {
                    rule: rule
                }
            });
        }
        ctrl.pauseRule = function (action, rule) {
            rule.active = !rule.active;
            Socket.uiEvent({
                namespace: ns,
                event: 'pauseRule',
                data: {
                    rule: rule
                }
            });
        }

        Socket.on("shaksyhane:rewrite-rules:updated", ctrl.updateRules);

        Socket.on("options:update", ctrl.update);

        $scope.$on("$destory", function () {
            Socket.off("options:update", ctrl.update);
        });
    }

})(angular);
