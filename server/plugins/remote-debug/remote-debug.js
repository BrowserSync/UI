var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");

/**
 * @type {Immutable.Set}
 */
var timestamp;
const WEINRE_REMOTE = "http://localhost:8080/target/target-script-min.js#anonymous";
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

        var socket   = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients  = bs.io.of(bs.options.getIn(["socket", "namespace"]));
        var external = require("url").parse(bs.getOptionIn(["urls", "external"]));
        var port     = 8080;

        socket.on("connection", function (client) {

            client.on("cp:debugger:toggle", toggleDebugger.bind(null, socket, cp, bs));

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
        bs.setOption("remote-debug", _debugger, true);
        socket.emit("cp:debugger:enabled", _debugger);
        bs.io.of(
            bs.options.getIn(["socket", "namespace"])
        ).emit("cp:add:script", {src: _debugger.url + "/target/target-script-min.js#browsersync"});
    } else {
        disableDebugger(cp, bs);
        socket.emit("cp:debugger:disabled");
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
        bs.setOption("remote-debug", false);
    }
}