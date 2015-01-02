var portScanner = require("portscanner");

module.exports = {
    findAFreePort: function (cp, done) {
        var port = cp.opts.get("port");
        portScanner.findAPortNotInUse(port, port + 100, {
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
     *
     */
    initDefaultHooks: function (cp, done) {
        done(null, {
            instance: {
                pageMarkup:  cp.pluginManager.hook("markup"),
                clientJs:    cp.pluginManager.hook("client:js"),
                templates:   cp.pluginManager.hook("templates"),
                pagesConfig: cp.pluginManager.hook("page", function (err, pages) {
                    cp.pages = pages;
                })
            }
        })
    },
    /**
     * @param cp
     * @param done
     */
    startServer: function (cp, done) {

        var server      = require("./server");
        var port        = cp.opts.get("port");
        var socketMw    = cp.bs.getMiddleware("socket-js");
        var connectorMw = cp.bs.getMiddleware("connector");

        cp.logger.info("Using port %s", port);

        done(null, {
            instance: {
                server: server(cp, socketMw, connectorMw).listen(port)
            }
        });

        //require("./server/transform.options")(cp.bs);
    },
    registerPlugins: function (cp, done) {
        Object.keys(cp.defaultPlugins).forEach(function (key) {
            cp.pluginManager.get(key)(cp, cp.bs);
        });
        done();
    },
    addOptionsEvent: function (cp, done) {
        var bs = cp.bs;
        bs.io.on("connection", function (client) {
            client.on("cp:get:options", function () {
                client.emit("cp:receive:options", bs.getOptions().toJS());
            });
        });
        done();
    }
};