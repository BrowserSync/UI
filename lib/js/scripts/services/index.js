/**
 * @type {angular}
 */
var app = require("../module");

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
app.service("ContentSections", function (contentSections) {

    return {
        enable: function (section) {
            angular.forEach(contentSections, function (item) {
                item.active = false;
            });
            section.active = true;
            return contentSections;
        }
    }
});