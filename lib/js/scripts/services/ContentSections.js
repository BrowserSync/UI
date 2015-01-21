/**
 * @type {angular}
 */
var app = require("../module");

app.service("ContentSections", ["contentSections", "$location", ContentSections]);

/**
 * @param contentSections
 * @returns {{enable: enable, transform: transform}}
 * @constructor
 */
function ContentSections(contentSections, $location) {

    return {
        /**
         * Enable a single Item
         * @param $section
         * @returns {*}
         */
        enable: function ($section) {
            angular.forEach(contentSections, function (item) {
                item.active = false;
            });
            $section.active = true;
            return contentSections;
        },
        /**
         * Transform an item
         */
        transform: function ($section, fn) {
            if (typeof fn === "function") {
                return $section = fn($section);
            } else {
                throw new TypeError("Noooo");
            }
        },
        /**
         * Get the current section based on the path
         * @returns {*}
         */
        current: function () {
            if ($location.path() === "/") {
                return contentSections["overview"];
            }
            var match;
            angular.forEach(contentSections, function (item) {
                if (item.path === $location.path()) {
                    match = item;
                }
            });
            return match;
        }
    };
}