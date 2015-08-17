(function (angular) {

    var OPT_PATH = ["shakyshane", "rewrite-rules"];
    var NS       = OPT_PATH.join(":");

    angular
        .module("BrowserSync")
        .directive("rewriteRule", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "rule": "=",
                    "editRule": "&",
                    "index": "="
                },
                templateUrl: "rewrite-rules/rewrite.list.html",
                controller: ["$scope", "Socket", "Store", "Clients", rewriteRuleDirective],
                controllerAs: "ctrl"
            };
        });

    /**
     * This directive handles a single rewrite-rule in the list
     * @param $scope
     * @param Socket
     * @param Store
     * @param Clients
     */
    function rewriteRuleDirective ($scope, Socket, Store, Clients) {

        var ctrl      = this;

        /**
         * Current rule
         */
        ctrl.rule     = $scope.rule;

        /**
         * Allow this item to call .editRule(rule) method of it's parent
         * @type {string|*}
         */
        ctrl.editRule = $scope.editRule;

        /**
         * Allow a rule to be paused/resumed
         * @param action
         * @param rule
         */
        ctrl.pauseRule = function (action, rule) {
            rule.active = !rule.active;
            Socket.uiEvent({
                namespace: NS,
                event: 'pauseRule',
                data: {
                    rule: rule
                }
            });
        };

        /**
         * Remove a rule
         * @param action
         * @param rule
         */
        ctrl.removeRule = function (action, rule) {
            Socket.uiEvent({
                namespace: NS,
                event: 'removeRule',
                data: {
                    rule: rule
                }
            });
        };
    }

})(angular);
