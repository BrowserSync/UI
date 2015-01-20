"use strict";
var app    = require("./module");

app.controller("MainController", [
    "$scope",
    "$rootScope",
    "$location",
    "$injector",
    MainCtrl
]);


/**
 * @param $$scope
 * @param $rootScope
 * @param $location
 * @param $injector
 * @constructor
 */
function MainCtrl ($$scope, $rootScope, $location, $injector) {

    var $scope      = this;
    $scope.options  = false;
    $scope.browsers = [];
    $scope.socketId = "";

    var contentSections = $injector.get("contentSections");
    var ContentSections = $injector.get("ContentSections");
    var Socket          = $injector.get("Socket");
    var Clients         = $injector.get("Clients");

    $scope.ui = {
        menu:         contentSections,
        sectionMenu:  false,
        disconnected: false
    };

    /**
    * @param $section
    */
    $scope.setActiveSection = function ($section) {
        ContentSections.enable($section);
        $location.path($section.path);
        $scope.ui.sectionMenu = false;
    };

    /**
     * Refresh all event
     */
    $scope.reloadAll = function () {
        Clients.reloadAll();
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Reload All Browsers  ✔"
        });
    };

    /**
     * @param value
     */
    $scope.scrollAllTo = function () {
        Clients.scrollAllTo(0);
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Scroll all browsers to Y=0  ✔"
        });
    };

    /**
    * Emit the socket event
    */
    $scope.sendAllTo = function (path) {
        Clients.sendAllTo(path);
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Reset all Browsers to /"
        });
    };

    /**
    *
    */
    $scope.toggleMenu = function () {
        $scope.ui.sectionMenu = !$scope.ui.sectionMenu;
    };

    /**
    * @type {{connection: connection, addBrowsers: addBrowsers}}
    */
    $scope.socketEvents = {

        /**
         * @param options
         */
        connection: function (options) {
            $scope.update(options);
        },
        /**
         *
         */
        disconnect: function () {
            $scope.ui.disconnected = true;
        }
    };

    /**
    * Update the current $scope
    */
    $scope.update = function (options) {

        $scope.options = transformOptions(options);
        $scope.ui.disconnected = false;

        ContentSections.transform(contentSections["overview"], function ($section) {
            return $section;
        });
    };


    console.log(ContentSections.current());
    /**
    * Set the currently active page
    */
    $scope.setActiveSection(ContentSections.current());

    /**
    * Get options from socket connection
    */
    Socket.options().then($scope.socketEvents.connection);

    /**
    * React to disconnects
    */
    $rootScope.$on("cp:disconnect", $scope.socketEvents.disconnect);
    $rootScope.$on("cp:connection", function (evt, options) {
        $scope.socketEvents.connection(options);
        $$scope.$digest();
    });
}

/**
 * Options transformations
 * @param options
 * @returns {*}
 */
function transformOptions(options) {

    options.displayUrl = getDisplayUrl(options.urls);

    return options;
}

/**
 * @param urls
 * @returns {*}
 */
function getDisplayUrl (urls) {
    if (!urls) {
        return false;
    }
    return urls.external || urls.local;
}