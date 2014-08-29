/**
 * @type {angular}
 */
require("../module").directive("urlSync", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        templateUrl: "js/templates/url-sync.html",
        controller: ["$scope", "$rootScope", "Socket", urlSyncController]
    };
});

/**
 * Controller for the URL sync
 * @param $scope
 * @param $rootScope
 * @param Socket
 */
function urlSyncController($scope, $rootScope, Socket) {
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

        window.setTimeout(notify.bind(null, $scope, $rootScope), 500);
    };
}

/**
 * Let the user know shit is happening
 */
function notify($scope, $rootScope) {

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


