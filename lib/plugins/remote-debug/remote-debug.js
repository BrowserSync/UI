var urls           = require("../../urls");
var url            = require("url");
var path           = require("path");
var fs             = require("fs");
var Immutable      = require("immutable");
var clientFiles    = require("./client-files");

const PLUGIN_NAME = "Remote Debug";

/**
 * @type {Immutable.Set}
 */
var weinreApp;

const WEINRE_NAME      = "weinre";
const WEINRE_PORT      = 8080;
const WEINRE_ID        = "#browsersync";
const WEINRE_ELEM_ID   = "__browser-sync-weinre__";

var weinreTargetUrl    = {
    protocol: "http:",
    port: WEINRE_PORT,
    pathname: "/target/target-script-min.js",
    hash: WEINRE_ID
};

var weinreClientUrl    = {
    protocol: "http:",
    port: WEINRE_PORT,
    pathname: "/client/",
    hash: WEINRE_ID
};

var clientScripts = Immutable.Map();

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param ui
     * @param bs
     */
    "plugin": function (ui, bs) {

        var hostUrl  = getHostUrl(ui, bs);

        weinreTargetUrl.hostname = hostUrl.hostname;
        weinreClientUrl.hostname = hostUrl.hostname;

        ui.setOption(WEINRE_NAME, Immutable.fromJS({
            name:  WEINRE_NAME,
            active: false,
            url:    false,
            targetUrl: url.format(weinreTargetUrl),
            clientUrl: url.format(weinreClientUrl),
            port: WEINRE_PORT
        }));

        ui.socket.on("connection", function (client) {
            client.on("cp:weinre:toggle",      toggleWeinre.bind(null, ui.socket, ui.clients, ui, bs));
            client.on("cp:clientfile:enable",  enableClientFile.bind(null, ui));
            client.on("cp:clientfile:disable", disableClientFile.bind(null, ui.clients, ui, bs));
        });

        ui.clients.on("connection", function (client) {
            clientScripts.map(function (item) {
                ui.addElement(client, item);
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
        elements: clientFiles.css
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};

/**
 * Get a suitable host URL for weinre
 * @param ui
 * @param bs
 * @returns {*}
 */
function getHostUrl(ui, bs) {

    var url = bs.getOptionIn(["urls", "external"]);

    if (!url) {
        url = bs.getOptionIn(["urls", "local"]);
    }

    return require("url").parse(url);
}

/**
 * If it's snippet mode, create a url that contains host
 * @param targetPath
 * @param ui
 * @param bs
 */
function getRemoteUrl(targetPath, ui, bs) {
    if (bs.options.get("mode") === "snippet") {
        return ["//", getHostUrl(ui, bs).host, targetPath].join("");
    }
    return targetPath;
}

/**
 * @param ui
 * @param file
 */
function enableClientFile (ui, file) {
    clientScripts = ui.enableElement(clientScripts, file);
}

/**
 *
 */
function disableClientFile (clients, ui, bs, file) {
    clientScripts = ui.disableElement(clientScripts, file);
}

/**
 * @param socket
 * @param clients
 * @param ui
 * @param bs
 * @param value
 */
function toggleWeinre (socket, clients, ui, bs, value) {

    if (value !== true) {
        value = false;
    }

    if (value) {

        var _debugger = enableWeinre(ui, bs);

        // set the state of weinre
        ui.setMany(function (item) {
            item.setIn([WEINRE_NAME, "active"], true);
            item.setIn([WEINRE_NAME, "url"], _debugger.url);
            item.setIn([WEINRE_NAME, "active"], true);
        }, {silent: true});

        // Let the UI know about it
        socket.emit("cp:weinre:enabled", _debugger);
        var fileitem = {
            type: "js",
            src: ui.getOptionIn([WEINRE_NAME, "targetUrl"]),
            id: WEINRE_ELEM_ID
        };

        // Add the element to all clients
        ui.addElement(clients, fileitem);

        // Save for page refreshes
        clientScripts = clientScripts.set("weinre", fileitem);

    } else {

        // Stop it
        disableWeinre(ui, bs);

        clientScripts = clientScripts.remove("weinre");

        // Reset the state
        ui.setOptionIn([WEINRE_NAME, "active"], false, {silent: false}); // Force a reload here

        // Let the UI know
        socket.emit("cp:weinre:disabled");

        // Reload all browsers to remove weinre elements/JS
        clients.emit("browser:reload");

    }
}

/**
 * Enable the debugger
 * @param ui
 * @param bs
 * @returns {{url: string, port: number}}
 */
function enableWeinre (ui, bs) {

    if (weinreApp) {
        weinreApp.close();
        weinreApp = false;
    }

    var port     = ui.getOptionIn([WEINRE_NAME, "port"]);

    var logger   = require(path.resolve(__dirname, "../../../node_modules", "weinre", "lib", "utils.js"));

    logger.log = function (message) {
        ui.logger.debug("[weinre]: %s", message);
    };

    var weinre   = require("weinre");
    var external = getHostUrl(ui, bs);

    weinreApp = weinre.run({
        httpPort: port,
        boundHost: external.hostname,
        verbose: false,
        debug: false,
        readTimeout: 5,
        deathTimeout: 15 });

    return ui.options.get(WEINRE_NAME).toJS();
}

/**
 * @param ui
 * @param bs
 * @returns {any|*}
 */
function disableWeinre (ui, bs) {
    if (weinreApp) {
        weinreApp.close();
        weinreApp = false;
    }
    return ui.options.get(WEINRE_NAME).toJS();
}