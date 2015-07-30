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
        var config = ctrl.plugin.opts.config;

        ctrl.buttonText = "Add Rewrite Rule";

        ctrl.state = {
            classname: "ready",
            adding: false
        };

        ctrl.inputs = {
            match: '',
            replace: ''
        };

        ctrl.showInputs = function () {
            if (!ctrl.state.adding) {
                ctrl.state.adding = true;
                ctrl.buttonText = "Cancle";
            } else {
                ctrl.state.adding = false;
                ctrl.buttonText = "Add Rewrite Rule";
            }
        };

        ctrl.toggleState = function (rule) {
            rule.active = !rule.active;
        };

        ctrl.resetForm = function () {
            ctrl.buttonText     = "Add Rewrite Rule";
            ctrl.inputs.match   = "";
            ctrl.inputs.replace = "";
        };

        ctrl.saveRule = function (inputs) {
            ctrl.state.classname = 'waiting';
            setTimeout(function () {
                ctrl.state.classname = 'success';
                $scope.$digest();
                setTimeout(function () {
                    ctrl.state.classname = 'ready';
                    ctrl.state.adding = false;
                    ctrl.resetForm();
                    $scope.$digest();
                }, 1000 );
            }, 500);
        };

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
        };

        ctrl.pauseRule = function (action, rule) {
            rule.active = !rule.active;
            Socket.uiEvent({
                namespace: ns,
                event: 'pauseRule',
                data: {
                    rule: rule
                }
            });
        };

        Socket.on(config.EVENT_UPDATE, ctrl.updateRules);

        Socket.on("options:update", ctrl.update);

        $scope.$on("$destory", function () {
            Socket.off("options:update", ctrl.update);
        });
    }

})(angular);
