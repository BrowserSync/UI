(function (angular) {

    var OPT_PATH    = ["shakyshane", "rewrite-rules"];
    var NS          = OPT_PATH.join(":");
    var PLUGIN_NAME = "Rewrite Rules";

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
                templateUrl: "rewrite-rules/rewrite.directive.html",
                controller: ["$scope", "Socket", "Store", "Clients", rewriteRulesDirective],
                controllerAs: "ctrl"
            };
        });
    angular
        .module("BrowserSync")
        .directive("stateButton", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "fn": "&",
                    "state": "=",
                    "on": "@",
                    "off": "@"
                },
                templateUrl: "rewrite-rules/rewrite.state-button.html"
            };
        });

    /**
     * Rewrite Rules Directive
     * @param $scope
     * @param Socket
     * @param Store
     * @param Clients
     */
    function rewriteRulesDirective($scope, Socket, Store, Clients) {

        var ctrl    = this;

        ctrl.plugin = $scope.options.userPlugins.filter(function (item) {
            return item.name === PLUGIN_NAME;
        })[0];

        ctrl.plugin.opts = $scope.uiOptions[OPT_PATH[0]][OPT_PATH[1]];
        ctrl.rules       = ctrl.plugin.opts.rules;

        var config = ctrl.plugin.opts.config;
        var store  = Store.create(NS);

        ctrl.nextUpdate = [];

        ctrl.state = {
            classname: "ready",
            adding: false,
            editing: false
        };

        ctrl.inputs = {
            match: {
                type: 'string',
                value: '',
                flags: ''
            },
            replace: {
                type: 'string',
                value: ''
            }
        };

        ctrl.showInputs = function () {
            ctrl.resetForm();
            if (!ctrl.state.adding) {
                ctrl.state.adding = true;
                ctrl.buttonText = "Cancel";
            } else {
                ctrl.state.adding = false;
                ctrl.buttonText = "Add new";
            }
        };

        ctrl.isMatchType = function (type) {
            return ctrl.inputs.match.type === type;
        };

        ctrl.isReplaceType = function (type) {
            return ctrl.inputs.replace.type === type;
        };

        ctrl.setMatchType = function (type) {
            ctrl.inputs.match.type = type;
        };

        ctrl.setReplaceType = function (type) {
            ctrl.inputs.replace.type = type;
        };

        ctrl.setReplaceType = function (type) {
            ctrl.inputs.replace.type = type;
        };

        ctrl.toggleState = function (rule) {
            rule.active = !rule.active;
        };

        ctrl.resetForm = function () {
            ctrl.buttonText = "Add new";
            ctrl.showErrors = false;
            ctrl.inputs.match.value   = "";
            ctrl.inputs.match.flags   = "";
            ctrl.inputs.replace.value = "";
            ctrl.state.editing = false;
        };

        ctrl.editRule = function (rule) {
            ctrl.state.editing = true;
            ctrl.state.currentRule = rule;
            ctrl.buttonText = 'Cancel';
            ctrl.inputs.match.value = rule.matchInput;
            ctrl.inputs.match.type  = rule.matchType;

            if (ctrl.inputs.match.type === 'regex') {
                ctrl.inputs.match.flags = rule.matchFlags;
            }

            ctrl.inputs.replace.value = rule.replaceInput;
            ctrl.inputs.replace.type  = rule.replaceType;

            ctrl.state.adding = true;
        };

        ctrl.saveRule = function (after) {

            if (after === 'reload') {
                ctrl.nextUpdate.push(function () {
                    Clients.reloadAll();
                });
            }

            var match   = ctrl.inputs.match;
            var replace = ctrl.inputs.replace;
            var obj     = {};

            if (ctrl.state.editing) {
                obj.id = ctrl.state.currentRule.id;
            }

            if (!$scope.rewriteForm.$valid) {
                ctrl.showErrors = true;
                return;
            }

            obj.match   = match;
            obj.replace = replace;

            Socket.uiEvent({
                namespace: NS,
                event: 'addRule',
                data: obj
            });

            ctrl.state.classname = 'waiting';

            setTimeout(function () {
                ctrl.state.classname = 'success';
                $scope.$digest();
                setTimeout(function () {
                    ctrl.state.classname = 'ready';
                    ctrl.state.adding = false;
                    ctrl.resetForm();
                    $scope.$digest();
                }, 300);
            }, 300);
        };

        var prev = store.get('previous');

        if (prev) {
            console.log('Previous items exist');
            if (prev[Socket.sessionId]) {
                //prev = prev[Socket.sessionId];
                //console.log('Previous items exist for CURRENT session');
                //var uniq = prev.filter(function (item) {
                //    var matches = ctrl.rules.filter(function (rule) {
                //        return item.id !== rule.id;
                //    });
                //    return !matches.length;
                //});
                //if (uniq.length) {
                //    ctrl.previousRules = prev;
                //}
            } else {
                //console.log('Previous items exist for PREVIOUS session');
                prev = prev[Object.keys(prev)[0]];
                if (prev.length && ctrl.rules.length) {
                    //console.log('BOTH');
                    //console.log('uniq');
                } else {
                    ctrl.previousRules = prev;
                }
            }
        }

        ctrl.updateOptions = function (data) {
            ctrl.plugin.opts = data.opts;
            ctrl.rules = data.rules;
            $scope.$digest();
        };

        ctrl.restorePreviousRules = function () {
            Socket.uiEvent({
                namespace: NS,
                event: 'replaceRules',
                data: ctrl.previousRules
            });
            ctrl.previousRules = false;
        };

        ctrl.updateRules = function (data) {

            ctrl.rules = data.rules;

            if (ctrl.nextUpdate.length) {
                ctrl.nextUpdate.forEach(function (fn) {
                    fn(data);
                    var obj = {}
                    obj[Socket.sessionId] = ctrl.rules;
                    store.set('previous', obj);
                });
            }

            ctrl.nextUpdate = [];
            $scope.$digest();
        };

        Socket.on(config.EVENT_UPDATE, ctrl.updateRules);

        Socket.on("options:update", ctrl.updateOptions);

        $scope.$on("$destory", function () {
            Socket.off(config.EVENT_UPDATE, ctrl.updateRules);
            Socket.off("options:update", ctrl.updateOptions);
        });
    }

})(angular);
