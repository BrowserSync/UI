(function (angular) {

    const SECTION_NAME = "history";
    var module         = angular.module("BrowserSync");

    module.controller("HelpAboutController", [
        "$scope",
        "options",
        "History",
        "Socket",
        "contentSections",
        function helpAboutController($scope, options, History, Socket, contentSections) {
            $scope.options = options;
            $scope.section = contentSections[SECTION_NAME];
        }
    ]);

})(angular);

