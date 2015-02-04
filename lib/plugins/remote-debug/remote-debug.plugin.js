var path           = require("path");
var fs             = require("fs");
var weinre         = require("./weinre");
var latencyPlugin  = require("./latency");
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

        weinre.init(ui);

        ui.latency = latencyPlugin.init(ui, bs);

        ui.socket.on("connection", function (client) {
            client.on("cp:weinre:toggle",      weinre.toggleWeinre.bind(null, ui.socket, ui.clients, ui, bs));
            client.on("cp:latency",            ui.latency.event);
            client.on("cp:clientfile:enable",  enableClientFile.bind(null, ui));
            client.on("cp:clientfile:disable", disableClientFile.bind(null, ui));
        });
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "remote-debug.html")),
        "client:js": require("fs").readFileSync(__dirname + "/remote-debug.client.js"),
        "templates": [
            getPath("/latency.html")
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
 * @param ui
 * @param file
 */
function enableClientFile (ui, file) {
    ui.enableElement(file);
}

/**
 *
 */
function disableClientFile (ui, file) {
    ui.disableElement(file);
}

/**
 * @param filepath
 * @returns {*}
 */
function getPath (filepath) {
    return path.join(__dirname, filepath);
}

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

module.exports.throttleMiddleware = throttleMiddleware;