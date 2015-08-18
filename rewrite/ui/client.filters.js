(function (angular) {

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
                            var fn = new Function(viewValue)();
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
