var Immutable = require("immutable");

module.exports.init = function (ui) {

    var optPath = ["network-throttle"];

    ui.setOptionIn(optPath, Immutable.fromJS({
        name: "network-throttle",
        title: "Network Throttle",
        active: false,
        tagline: "Simulate a slow connection across all devices",
        targets: require("./targets")
    }));

    ui.setOptionIn(optPath.concat(['servers']), Immutable.Map({}));

    var methods = {

        "server:create": function (data) {
            var port = parseInt(data.port, 10);
            if (typeof port !== "number") {
                data.port = false;
            }
            data.cb = function (err, out) {
                console.log(ui.getOptionIn(optPath.concat(['servers'])));
            };

            methods["toggle:speed"](data, port);
        },
        "toggle:speed": function (opts) {

            var cb = opts.cb || function () {/*noop*/};
            var name = opts.item.name;
            //console.log(opts);
            /**
             * @param err
             * @param out
             */
            createServer(ui, opts.item, function (err, out) {
                if (err) {
                    return cb(err);
                }
                if (!ui.servers) {
                    ui.servers = {};
                }

                ui.servers[out.port] = out.server;
                var urls = getUrls({port: out.port, urls: ui.bs.getOption("urls").toJS()});

                ui.setMany(function (item) {
                    item.setIn(optPath.concat(['servers', out.port]), Immutable.Map({
                        port: out.port,
                        speed: opts.item,
                        urls: getUrls({port: out.port, urls: ui.bs.getOption("urls").toJS()})
                    }));
                });

                ui.socket.emit("ui:network-throttle:update", {
                    name: name,
                    urls: urls,
                    servers: ui.getOptionIn(optPath.concat('servers')).toJS()
                });

                cb(null, out);
            });
        },
        event: function (event) {
            methods[event.event](event.data);
        },
        toggleSpeed: toggleSpeed
    };

    return methods;
};

function createServer (ui, data, cb) {

    //var optPath = ["network-throttle"];

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
}

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