var urls           = require("../../urls");
var url            = require("url");
var path           = require("path");
var fs             = require("fs");
var Immutable      = require("immutable");
var pesticide      = fs.readFileSync(__dirname + "/css/pesticide.min.css", "utf-8");
//var pesticideDepth = fs.readFileSync(__dirname + "/css/pesticide-depth.css", "utf-8");

/**
 * @type {Immutable.Set}
 */
var timestamp;
var weinreApp;

const PESTICIDE_NAME   = "pesticide";
const PESTICIDE_URL    = "/browser-sync/pesticide.css";
const PESTICIDE_ID     = "__browser-sync-pesticide__";
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
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        var socket   = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients  = bs.io.of(bs.options.getIn(["socket", "namespace"]));

        var hostUrl  = getHostUrl(cp, bs);

        weinreTargetUrl.hostname = hostUrl.hostname;
        weinreClientUrl.hostname = hostUrl.hostname;

        bs.setOption(PESTICIDE_NAME, Immutable.fromJS({
            name:   PESTICIDE_NAME,
            active: false
        }));

        bs.setOption(WEINRE_NAME, Immutable.fromJS({
            name:  WEINRE_NAME,
            active: false,
            url:    false,
            targetUrl: url.format(weinreTargetUrl),
            clientUrl: url.format(weinreClientUrl),
            port: WEINRE_PORT
        }));

        socket.on("connection", function (client) {
            client.on("cp:weinre:toggle", toggleDebugger.bind(null, socket, clients, cp, bs));
            client.on("cp:pesticide:toggle", togglePesticide.bind(null, socket, clients, cp, bs));
        });

        clients.on("connection", function (client) {
            updateClients(clientScripts, client);
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
            title: "Remote Debug",
            template: "remote-debug.html",
            controller: "RemoteDebugController",
            order: 4,
            icon: "code"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": "Remote Debugger"
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
 * @param socket
 * @param cp
 * @param bs
 * @param value
 */
function togglePesticide (socket, clients, cp, bs, value) {

    if (value !== true) {
        value = false;
    }

    if (value) {
        bs.setOptionIn([PESTICIDE_NAME, "active"], true, {silent: true});
        clientScripts = clientScripts.set(PESTICIDE_NAME, {
            type: "css",
            src:  PESTICIDE_URL,
            id:   PESTICIDE_ID
        });
        bs.serveFile(PESTICIDE_URL, {
            type: "text/css",
            content: pesticide
        });
        updateClients(clientScripts, clients);
    } else {
        bs.setOptionIn([PESTICIDE_NAME, "active"], false, {silent: true});
        clientScripts = clientScripts.remove(PESTICIDE_NAME);
        clients.emit("cp:element:remove", {id: PESTICIDE_ID});
    }
}

/**
 * @param elements
 * @param clients
 */
function updateClients (elements, clients) {
    elements.map(function (value) {
        clients.emit("cp:element:add", value);
    });
}

/**
 * @param socket
 * @param clients
 * @param cp
 * @param bs
 * @param value
 */
function toggleDebugger (socket, clients, cp, bs, value) {

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

        // Let the control panel know about it
        socket.emit("cp:weinre:enabled", _debugger);

        // Add the JS script to the clients elements list
        clientScripts = clientScripts.set(WEINRE_NAME, {
            type: "js",
            src: bs.getOptionIn([WEINRE_NAME, "targetUrl"]),
            id: WEINRE_ELEM_ID
        });

        // Update all client elements
        updateClients(clientScripts, clients);

    } else {
        // Stop it
        disableWeinre(cp, bs);

        // Reset the state
        bs.setOptionIn([WEINRE_NAME, "active"], false, {silent: false}); // Force a reload here

        // Remove the script from client elements list
        clientScripts = clientScripts.remove(WEINRE_NAME);

        // Let the control panel know
        socket.emit("cp:weinre:disabled");

        // Let the clients know.
        clients.emit("cp:element:remove", {id: WEINRE_ELEM_ID});
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
    var weinre   = require("weinre/lib/weinre");
    var external = require("url").parse(bs.getOptionIn(["urls", "external"]));

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