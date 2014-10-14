/**
 * @type {angular}
 */
var app = require("../module");

/**
 * Default contentSections
 */
app.value("contentSections", {
    "server-info": {
        title: "Server Info",
        active: true,
        order: 1
    },
    "ghostmode": {
        title: "GhostMode Options",
        active: false,
        order: 2
    },
    "locations": {
        title: "Locations",
        active: false,
        order: 3
    }
});

/**
 *
 */
app.service("ContentSections", ["contentSections", ContentSections]);

/**
 * @param contentSections
 * @returns {{enable: enable, transform: transform}}
 * @constructor
 */
function ContentSections(contentSections) {

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
        }
    }
}