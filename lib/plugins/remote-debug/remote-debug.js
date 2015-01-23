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
var timestamp;
var weinreApp;

const WEINRE_NAME          = "weinre";
const WEINRE_PORT          = 8080;
const WEINRE_ID            = "#browsersync";
const WEINRE_ELEM_ID       = "__browser-sync-weinre__";

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
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        var hostUrl  = getHostUrl(cp, bs);

        weinreTargetUrl.hostname = hostUrl.hostname;
        weinreClientUrl.hostname = hostUrl.hostname;

        bs.setOption(WEINRE_NAME, Immutable.fromJS({
            name:  WEINRE_NAME,
            active: false,
            url:    false,
            targetUrl: url.format(weinreTargetUrl),
            clientUrl: url.format(weinreClientUrl),
            port: WEINRE_PORT
        }));

        cp.socket.on("connection", function (client) {
            client.on("cp:weinre:toggle",      toggleWeinre.bind(null, cp.socket, cp.clients, cp, bs));
            client.on("cp:clientfile:enable",  enableClientFile.bind(null, cp));
            client.on("cp:clientfile:disable", disableClientFile.bind(null, cp.clients, cp, bs));
        });

        cp.clients.on("connection", function (client) {
            clientScripts.map(function (item) {
                addElement(client, item);
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
 * @param cp
 * @param bs
 * @returns {*}
 */
function getHostUrl(cp, bs) {

    var url = bs.getOptionIn(["urls", "external"]);

    if (!url) {
        url = bs.getOptionIn(["urls", "local"]);
    }

    return require("url").parse(url);
}

/**
 * If it's snippet mode, create a url that contains host
 * @param targetPath
 * @param cp
 * @param bs
 */
function getRemoteUrl(targetPath, cp, bs) {
    if (bs.options.get("mode") === "snippet") {
        return ["//", getHostUrl(cp, bs).host, targetPath].join("");
    }
    return targetPath;
}

/**
 * @param cp
 * @param file
 */
function enableClientFile (cp, file) {
    clientScripts = cp.enableElement(clientScripts, file);
}

/**
 *
 */
function disableClientFile (clients, cp, bs, file) {
    clientScripts = cp.disableElement(clientScripts, file);
}

/**
 * @param socket
 * @param clients
 * @param cp
 * @param bs
 * @param value
 */
function toggleWeinre (socket, clients, cp, bs, value) {

    if (value !== true) {
        value = false;
    }

    if (value) {

        var _debugger = enableWeinre(cp, bs);

        // set the state of weinre
        bs.setMany(function (item) {
            item.setIn([WEINRE_NAME, "active"], true);
            item.setIn([WEINRE_NAME, "url"], _debugger.url);
            item.setIn([WEINRE_NAME, "active"], true);
        }, {silent: true});

        // Let the UI know about it
        socket.emit("cp:weinre:enabled", _debugger);
        var fileitem = {
            type: "js",
            src: bs.getOptionIn([WEINRE_NAME, "targetUrl"]),
            id: WEINRE_ELEM_ID
        };

        // Add the element to all clients
        addElement(clients, fileitem);

        // Save for page refreshes
        clientScripts = clientScripts.set("weinre", fileitem);

    } else {

        // Stop it
        disableWeinre(cp, bs);

        clientScripts = clientScripts.remove("weinre");

        // Reset the state
        bs.setOptionIn([WEINRE_NAME, "active"], false, {silent: false}); // Force a reload here

        // Let the UI know
        socket.emit("cp:weinre:disabled");

        // Reload all browsers to remove weinre elements/JS
        clients.emit("browser:reload");

    }
}

/**
 * Enable the debugger
 * @param cp
 * @param bs
 * @returns {{url: string, port: number}}
 */
function enableWeinre (cp, bs) {

    if (weinreApp) {
        weinreApp.close();
        weinreApp = false;
    }

    var port     = bs.options.getIn([WEINRE_NAME, "port"]);

    var logger   = require(path.resolve(__dirname, "../../../node_modules", "weinre", "lib", "utils.js"));

    logger.log = function (message) {
        cp.logger.debug("[weinre]: %s", message);
    };

    var weinre   = require("weinre");
    var external = getHostUrl(cp, bs);

    weinreApp = weinre.run({
        httpPort: port,
        boundHost: external.hostname,
        verbose: false,
        debug: false,
        readTimeout: 5,
        deathTimeout: 15 });

    return bs.options.get(WEINRE_NAME).toJS();
}

/**
 * @param cp
 * @param bs
 * @returns {any|*}
 */
function disableWeinre (cp, bs) {
    if (weinreApp) {
        weinreApp.close();
        weinreApp = false;
    }
    return bs.options.get(WEINRE_NAME).toJS();
}

function addElement (clients, item) {
    clients.emit("cp:element:add", item);
}

function removeElement(clients, id) {
    clients.emit("cp:element:remove", {id: id});
}