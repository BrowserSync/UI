var Immutable = require("immutable");

module.exports.init = function (ui) {

    var optPath = ["network-throttle"];
    ui.servers  = {};

    ui.setOptionIn(optPath, Immutable.fromJS({
        name: "network-throttle",
        title: "Network Throttle",
        active: false,
        tagline: "Simulate a slow connection across all devices",
        targets: require("./targets")
    }));

    ui.setOptionIn(optPath.concat(['servers']), Immutable.Map({}));

    /**
     * @param input
     * @returns {number}
     */
    function getPortArg(input) {
        input = input.trim();
        if (input.length && input.match(/\d{3,5}/)) {
            input = parseInt(input, 10);
        } else {
            input = ui.bs.options.get("port") + 1;
        }
        return input;
    }

    /**
     * @returns {string}
     */
    function getTargetUrl() {
        return require("url").parse(ui.bs.options.getIn(["urls", "local"]));
    }

    var methods = {
        /**
         * @param data
         */
        "server:create": function (data) {

            data.port = getPortArg(data.port);

            /**
             * @param opts
             */
            function saveThrottleInfo (opts) {

                var urls = getUrls(ui.bs.options.set("port", opts.port).toJS());

                ui.setOptionIn(optPath.concat(['servers', opts.port]), Immutable.fromJS({
                    urls: urls,
                    speed: opts.speed
                }));

                ui.socket.emit("ui:network-throttle:update", {
                    servers: ui.getOptionIn(optPath.concat(['servers'])).toJS(),
                    event: "server:create"
                });

                ui.servers[opts.port] = opts.server;
            }

            /**
             * @param err
             * @param port
             */
            function createThrottle (err, port) {

                var throttleServer;
                var target = getTargetUrl();

                var args = {
                    port: port,
                    target: target,
                    speed: data.speed
                };

                if (ui.bs.getOption("scheme") === "https") {
                    var certs = require("browser-sync/lib/server/utils").getKeyAndCert(ui.bs.options);
                    args.key  = certs.key;
                    args.cert = certs.cert;
                }

                args.server = require("./throttle-server")(args);
                args.server.listen(port);

                saveThrottleInfo(args);
            }

            /**
             * Try for a free port
             */
            ui.bs.utils.portscanner.findAPortNotInUse(data.port, data.port + 100, "127.0.0.1", function (err, port) {
                if (err) {
                    return createThrottle(err);
                } else {
                    createThrottle(null, port);
                }
            });
        },
        /**
         * @param data
         */
        "server:destroy": function (data) {
            if (ui.servers[data.port]) {
                ui.servers[data.port].close();
                ui.setMany(function (item) {
                    item.deleteIn(optPath.concat(['servers', parseInt(data.port, 10)]));
                });
                delete ui.servers[data.port];
            }
            //console.log(ui.getOptionIn(optPath.concat(['servers'])).toJS());
            ui.socket.emit("ui:network-throttle:update", {
                servers: ui.getOptionIn(optPath.concat(['servers'])).toJS(),
                event: "server:destroy"
            });
        },
        /**
         * @param event
         */
        event: function (event) {
            methods[event.event](event.data);
        },
        toggleSpeed: toggleSpeed
    };

    return methods;
};

/**
 * @param ui
 * @param data
 */
function toggleSpeed (ui, data, cb) {

    var optPath = ["network-throttle"];

    if (data.active) {

        var target = require("url").parse(ui.bs.options.getIn(["urls", "local"]));

        var args = {
            speed: data.speed,
            latency: data.latency,
            ui: ui,
            bs: ui.bs,
            target: target,
            cb: cb
        };

        if (ui.bs.getOption("scheme") === "https") {
            var certs = require("browser-sync/lib/server/utils").getKeyAndCert(ui.bs.options);
            args.key  = certs.key;
            args.cert = certs.cert;
        }

        require("./throttle-server")(args);

    } else {
        /**
         * Disable / Delete a server.
         */
        ui.setOptionIn(optPath.concat(["targets", data.name, "active"]), false);
        ui.setOptionIn(optPath.concat(["targets", data.name, "urls"]), Immutable.List());
        if (ui.servers && ui.servers[data.name]) {
            ui.servers[data.name].server.close();
            ui.servers[data.name] = false;
        }
    }
}

/**
 * Get local + external urls with a different port
 * @param opts
 * @returns {List<T>|List<any>}
 */
function getUrls (opts) {

    var list    = [];

    var bsLocal = require("url").parse(opts.urls.local);

    list.push([bsLocal.protocol + "//", bsLocal.hostname, ":", opts.port].join(""));

    if (opts.urls.external) {
        var external = require("url").parse(opts.urls.external);
        list.push([bsLocal.protocol + "//", external.hostname, ":", opts.port].join(""));
    }

    return Immutable.List(list);
}