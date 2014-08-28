/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Notify', [])

    .directive("notifyElem", function () {

        return {
            restrict: "E",
            scope: {
                options: "="
            },
            templateUrl: "js/templates/notify-elem.html",

            controller: function ($scope, $rootScope) {

                /**
                 * Default state
                 * @type {{visible: boolean, status: string, heading: string, text: string}}
                 */
                $scope.ui = {
                    visible: false,
                    status: "success",
                    heading: "BrowserSync:",
                    text: "Dummy message bro"
                };

                /**
                 * @param evt
                 * @param data
                 */
                $scope.show = function (evt, data) {

                    data = data || {};

                    if ($scope._timer) {
                        clearTimeout($scope._timer);
                    }

                    $scope._timer = window.setTimeout($scope.reset, data.timeout || 2000);

                    if (data.message) {

                        $scope.ui.visible = true;
                        $scope.ui.status  = data.status || "info";
                        $scope.ui.text    = data.message;

                        if (data.heading) {
                            $scope.ui.heading  = data.heading;
                        }
                    }
                };

                $scope.reset = function () {
                    $scope.$apply(function () {
                        $scope.ui.visible = false;
                    })
                };

                $rootScope.$on("notify:flash", $scope.show);
            }
        }
    });