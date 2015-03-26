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

    var methods = {

        "toggle:speed": function (data) {
            var cb = data.cb || function () {/*noop*/};
            /**
             * @param err
             * @param out
             */
            toggleSpeed(ui, data, function (err, out) {
                if (err) {
                    return cb(err);
                }
                if (!ui.servers) {
                    ui.servers = {};
                }
                ui.servers[data.name] = out;
                ui.setMany(function (item) {
                    var path = optPath.concat(["targets", data.name]);
                    item.setIn(path.concat("active"), true);
                    item.setIn(path.concat("urls"),
                        getUrls({port: out.port, urls: ui.bs.getOption("urls").toJS()})
                    );
                });
                ui.socket.emit("ui:network-throttle:update", {
                    name: data.name,
                    target: ui.getOptionIn(optPath.concat(["targets", data.name])).toJS()
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