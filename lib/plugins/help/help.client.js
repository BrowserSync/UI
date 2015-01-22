(function (angular) {

    const SECTION_NAME = "history";
    var module         = angular.module("BrowserSync");

    module.controller("HelpAboutController", [
        "$scope",
        "options",
        "History",
        "Socket",
        "pagesConfig",
        function helpAboutController($scope, options, History, Socket, pagesConfig) {
            $scope.options = options;
            $scope.section = pagesConfig[SECTION_NAME];
        }
    ]);

})(angular);

