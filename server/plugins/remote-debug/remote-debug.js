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
var app;

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        bs.serveFile("/browser-sync/pesticide.css", {
            type: "text/css",
            content: pesticide
        });

        var socket   = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients  = bs.io.of(bs.options.getIn(["socket", "namespace"]));
        var external = require("url").parse(bs.getOptionIn(["urls", "external"]));
        var port     = 8080;

        bs.setOption("pesticide", Immutable.fromJS({
            name:   "pesticide",
            active: false
        }));

        bs.setOption("weinre", Immutable.fromJS({
            name:  "weinre",
            active: false,
            url:    false
        }));

        clients.on("connection", function (client) {
            if (app) {
                client.emit("cp:add:script", {src: ["http://", external.hostname, ":", port, "/target/target-script-min.js#browsersync"].join("")});
            }
            if (bs.options.getIn(["pesticide", "active"])) {
                client.emit("cp:add:css", {
                    src: "/browser-sync/pesticide.css",
                    id: "__bs-pesticide__"
                });
            }
        });

        socket.on("connection", function (client) {

            client.on("cp:weinre:toggle", toggleDebugger.bind(null, socket, cp, bs));
            client.on("cp:pesticide:toggle", togglePesticide.bind(null, socket, cp, bs));

            client.on("cp:get:debugger", function () {

                if (app) {

                    client.emit("cp:receive:enabled", {
                        url: ["http://", external.hostname, ":", port].join(""),
                        port: port,
                        active: true
                    });
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
 * @param socket
 * @param cp
 * @param bs
 * @param value
 */
function togglePesticide (socket, cp, bs, value) {

    if (value !== true) {
        value = false;
    }

    var clients = bs.io.of(
        bs.options.getIn(["socket", "namespace"])
    );

    if (value) {
        clients.emit("cp:add:css", {
            src: "/browser-sync/pesticide.css",
            id: "__bs-pesticide__"
        });
        bs.setOptionIn(["pesticide", "active"], true, true);
    } else {
        clients.emit("cp:element:remove", {
            id: "__bs-pesticide__"
        });
        bs.setOptionIn(["pesticide", "active"], false, true);
    }
}

/**
 * @param cp
 * @param bs
 * @param value
 */
function toggleDebugger (socket, cp, bs, value) {

    if (value !== true) {
        value = false;
    }

    if (value) {
        var _debugger = enableDebugger(cp, bs);
        bs.setOptionIn(["weinre", "active"], true);
        bs.setOptionIn(["weinre", "url"], _debugger.url);
        socket.emit("cp:weinre:enabled", _debugger);
        bs.io.of(
            bs.options.getIn(["socket", "namespace"])
        ).emit("cp:add:script", {src: _debugger.url + "/target/target-script-min.js#browsersync"});
    } else {
        disableDebugger(cp, bs);
        socket.emit("cp:weinre:disabled");
    }
}

/**
 * Enable the debugger
 * @param cp
 * @param bs
 * @returns {{url: string, port: number}}
 */
function enableDebugger (cp, bs) {

    if (app) {
        app.close();
        app = false;
    }

    var weinre   = require("weinre/lib/weinre");
    var external = require("url").parse(bs.getOptionIn(["urls", "external"]));
    var port     = 8080;

    app = weinre.run({
        httpPort: port,
        boundHost: external.hostname,
        verbose: false,
        debug: false,
        readTimeout: 5,
        deathTimeout: 15 });

    return {
        url: ["http://", external.hostname, ":", port].join(""),
        port: port,
        active: true
    };
}

function disableDebugger (cp, bs) {
    if (app) {
        app.close();
        app = false;
        bs.setOptionIn(["weinre", "active"], false);
    }
}