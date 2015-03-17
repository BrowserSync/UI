var weinre         = require("./weinre");
var latencyPlugin  = require("./latency");
var overlayPlugin  = require("./overlay-grid");
var clientFiles    = require("./client-files");

const PLUGIN_NAME  = "Remote Debug";
var timeout        = 0;

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param ui
     * @param bs
     */
    "plugin": function (ui, bs) {

        if (bs.options.get("scheme") === "https") {
            ui.setMany(function (item) {
                item.deleteIn(["clientFiles", "weinre"]);
            });
        } else {
            ui.weinre = weinre.init(ui);
        }

        ui.latency = latencyPlugin.init(ui, bs);
        ui.overlayGrid = overlayPlugin.init(ui, bs);

        /**
         * For for latency events
         */
        ui.listen("remote-debug:latency", ui.latency);

        /**
         * Listen for file events
         */
        ui.listen("remote-debug:files", {
            "enableFile": function (file) {
                console.log(file);
                ui.enableElement(file);
            },
            "disableFile": function (file) {
                ui.disableElement(file);
            }
        });

        /**
         * Listen for weinre toggles
         */
        ui.listen("remote-debug:weinre", ui.weinre);

        /**
         *
         */
        ui.listen("remote-debug:overlay-grid", ui.overlayGrid);
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fileContent("remote-debug.html"),
        "client:js": fileContent("/remote-debug.client.js"),
        "templates": [
            getPath("/latency.html"),
            getPath("/overlay-grid.html")
        ],
        "page": {
            path: "/remote-debug",
            title: PLUGIN_NAME,
            template: "remote-debug.html",
            controller: PLUGIN_NAME.replace(" ", "") + "Controller",
            order: 4,
            icon: "bug"
        },
        elements: clientFiles.files
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};

/**
 * @returns {Function}
 */
function throttleMiddleware () {
    return function (req, res, next) {
        setTimeout(function () {
            next();
        }, timeout);
    };
}

/**
 * @param filepath
 * @returns {*}
 */
function getPath (filepath) {
    return require("path").join(__dirname, filepath);
}

/**
 * @param filepath
 * @returns {*}
 */
function fileContent (filepath) {
    return require("fs").readFileSync(getPath(filepath));
}

module.exports.throttleMiddleware = throttleMiddleware;