(function (angular) {

    const SECTION_NAME = "history";

    angular
        .module("BrowserSync")
        .controller("HelpAboutController", [
            "options",
            "pagesConfig",
            helpAboutController
        ]);

    /**
     * @param options
     * @param pagesConfig
     */
    function helpAboutController(options, pagesConfig) {
        var ctrl = this;
        ctrl.options = options;
        ctrl.section = pagesConfig[SECTION_NAME];
    }

})(angular);

