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
                controller: ["$scope", "Socket", "Store", "Clients", rewriteRulesDirective],
                controllerAs: "ctrl"
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
        var ns      = OPT_PATH.join(":");

        ctrl.plugin = $scope.options.userPlugins.filter(function (item) {
            return item.name === "Rewrite Rules";
        })[0];

        ctrl.plugin.opts = $scope.uiOptions[OPT_PATH[0]][OPT_PATH[1]];
        ctrl.rules       = ctrl.plugin.opts.rules;

        var config = ctrl.plugin.opts.config;
        var store  = Store.create(ns);

        ctrl.buttonText = "Add Rewrite Rule";
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
                ctrl.buttonText = "Add Rewrite Rule";
            }
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
            ctrl.buttonText = "Add Rewrite Rule";
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
                namespace: ns,
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
                }, 1000 );
            }, 500);
        };

        var prev = store.get('previous');

        if (prev) {
            console.log('Previous items exist');
            if (prev[Socket.sessionId]) {
                console.log('Previous items exist for CURRENT session');
            } else {
                console.log('Previous items exist for PREVIOUS session');
                ctrl.previousRules = prev[Object.keys(prev)[0]];
            }
        }

        ctrl.updateOptions = function (data) {
            ctrl.plugin.opts = data.opts;
            ctrl.rules = data.rules;
            $scope.$digest();
        };

        ctrl.restorePreviousRules = function () {
            console.log(ctrl.previousRules);
            // todo - loop over each rule and save back to server.
            //ctrl.rules = ctrl.previousRules;
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

        Socket.on("options:update", ctrl.updateOptions);

        $scope.$on("$destory", function () {
            Socket.off(config.EVENT_UPDATE, ctrl.updateRules);
            Socket.off("options:update", ctrl.updateOptions);
        });
    }

    angular
        .module("BrowserSync")
        .directive('validFn', function() {
            return {
                require: 'ngModel',
                scope: {
                    validFn: "="
                },
                link: function(scope, elm, attrs, ctrl) {
                    ctrl.$validators.validFn = function(modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            // consider empty models to be valid
                            return true;
                        }

                        // String type is always valid
                        if (scope.validFn === 'string') {
                            return true;
                        }

                        try {
                            var fn = new Function(viewValue);
                            return true;
                        } catch (e) {
                            return false;
                        }

                        // it is invalid
                        return false;
                    };
                }
            };
    });

    angular
        .module("BrowserSync")
        .directive('validRegex', function() {
            return {
                require: 'ngModel',
                scope: {
                    validRegex: "=",
                    flags: "="
                },
                link: function(scope, elm, attrs, ctrl) {
                    ctrl.$validators.validRegex = function(modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            // consider empty models to be valid
                            return true;
                        }

                        // String type is always valid
                        if (scope.validRegex === 'string') {
                            return true;
                        }

                        try {
                            var fn = new RegExp(viewValue, scope.flags);
                            return true;
                        } catch (e) {
                            //console.log(e);
                            return false;
                        }

                        // it is invalid
                        return false;
                    };
                }
            };
        });

})(angular);
