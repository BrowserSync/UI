/**
 * @type {angular}
 */
var app       = require("../module");

/**
 * URL info header
 */
app.directive("urlSync", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        templateUrl: "js/templates/url-sync.html",
        controller: function ($scope, $rootScope, Socket) {

            /**
             * @type {{loading: boolean}}
             */
            $scope.ui = {
                loading: false
            };

            /**
             * @type {{local: *, current: string}}
             */
            $scope.urls = {
                local: $scope.options.urls.local,
                current: ""
            };

            /**
             * Emit the reload-all event
             */
            $scope.reloadAll = function () {

                $scope.ui.loading = true;

                Socket.emit("cp:browser:reload");

                window.setTimeout(notify, 500);
            };

            /**
             * Let the user know shit is happening
             */
            function notify() {
                $scope.$apply(function () {
                    $scope.ui.loading = false;
                    $rootScope.$broadcast("notify:flash", {
                        heading: "Instruction Sent:",
                        message: "Reload all browsers..",
                        status: "error",
                        timeout: 2000
                    });
                });
            }
        }
    };
});