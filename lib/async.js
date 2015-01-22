module.exports = {
    /**
     * The UI uses it's own server/port
     * @param cp
     * @param done
     */
    findAFreePort: function (cp, done) {
        var port = cp.opts.get("port");
        cp.bs.utils.portscanner.findAPortNotInUse(port, port + 100, {
            host: "localhost",
            timeout: 1000
        }, function (err, port) {
            if (err) {
                return done(err);
            }
            done(null, {
                options: {
                    port: port
                }
            });
        });
    },
    /**
     * Default hooks do things like creating/joining JS files &
     * building angular config
     * @param cp
     * @param done
     */
    initDefaultHooks: function (cp, done) {

        cp.pluginManager.hook("page", cp, function (err, out) {

            done(null, {
                instance: {
                    clientJs:    cp.pluginManager.hook("client:js"),
                    templates:   cp.pluginManager.hook("templates"),
                    pagesConfig: out.pagesConfig,
                    pages:       out.pagesObj,
                    pageMarkup:  out.pageMarkup
                }
            });
        });
    },
    /**
     * Simple static file server with some middlewares for custom
     * scripts/routes.
     * @param cp
     * @param done
     */
    startServer: function (cp, done) {

        var bs          = cp.bs;
        var port        = cp.opts.get("port");

        cp.logger.debug("Using port %s", port);

        var server = require("./server")(cp, {
            middleware: {
                socket: bs.getMiddleware("socket-js"),
                connector: bs.getSocketConnector(bs.options.get("port"), {
                    path: bs.options.getIn(["socket", "path"]),
                    namespace: cp.config.getIn(["socket", "namespace"])
                })
            }
        });

        done(null, {
            instance: {
                server: server.server.listen(port),
                app: server.app
            }
        });

    },
    /**
     * Run default plugins
     * @param cp
     * @param done
     */
    registerPlugins: function (cp, done) {
        Object.keys(cp.defaultPlugins).forEach(function (key) {
            cp.pluginManager.get(key)(cp, cp.bs);
        });
        done();
    },
    /**
     * The most important event is the initial connection where
     * the options are received from the socket
     * @param cp
     * @param done
     */
    addOptionsEvent: function (cp, done) {
        var bs = cp.bs;
        var socket  = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients = bs.io.of(bs.options.getIn(["socket", "namespace"]));
        socket.on("connection", function (client) {
            client.emit("connection", bs.getOptions().toJS());
            client.on("cp:get:options", function () {
                client.emit("cp:receive:options", bs.getOptions().toJS());
            });
            // proxy client events
            client.on("cp:client:proxy", function (evt) {
                clients.emit(evt.event, evt.data);
            });
        });
        done();
    }
};