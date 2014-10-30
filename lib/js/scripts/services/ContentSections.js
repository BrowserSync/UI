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
        slug: "/",
        active: true,
        order: 1
    },
    "sync-options": {
        title: "Sync Options",
        active: false,
        slug: "sync-options",
        order: 2
    },
    "history": {
        title: "History",
        active: false,
        slug: "history",
        order: 3
    },
    "plugins": {
        title: "Plugins",
        active: false,
        slug: "plugins",
        order: 4
    }
});

/**
 *
 */
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
        current: function () {
            if ($location.path() === "/") {
                return contentSections["server-info"];
            }
            var match;
            angular.forEach(contentSections, function (item) {
                if ("/" + item.slug === $location.path()) {
                    console.log(item);
                    match = item;
                }
            });
            return match;
        }
    }
}