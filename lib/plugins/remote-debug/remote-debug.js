var urls           = require("../../urls");
var url            = require("url");
var path           = require("path");
var fs             = require("fs");
var Immutable      = require("immutable");
var weinre         = require("./weinre");
var clientFiles    = require("./client-files");

const PLUGIN_NAME  = "Remote Debug";

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

        ui.socket.on("connection", function (client) {
            client.on("cp:weinre:toggle",      weinre.toggleWeinre.bind(null, ui.socket, ui.clients, ui, bs));
            client.on("cp:clientfile:enable",  enableClientFile.bind(null, ui));
            client.on("cp:clientfile:disable", disableClientFile.bind(null, ui));
        });

        ui.clients.on("connection", function (client) {
            ui.options.get("clientFiles").map(function (item) {
                if (item.get("active")) {
                    ui.addElement(client, item.toJS());
                }
            });
        });
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "remote-debug.html")),
        "client:js": require("fs").readFileSync(__dirname + "/remote-debug.client.js"),
        "templates": [
            //path.join(__dirname, "/remote-debug.directive.html")
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