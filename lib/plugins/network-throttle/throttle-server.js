var ThrottleGroup = require("stream-throttle").ThrottleGroup;

module.exports = function (opts) {

    var bs = opts.bs;

    var server = throttle(opts);
    var start = opts.port;

    if (!start) {
        start = bs.options.get("port") + 1;
    }

    var end   = start + 50;

    bs.utils.portscanner.findAPortNotInUse(start, end, "127.0.0.1", function (err, port) {
        if (err) {
            return opts.cb(err);
        } else {
            server.listen(port);
            opts.cb(null, {
                server: server,
                port: port
            });
        }
    });
};

/**
 *
 */
function throttle (opts) {

    var options = {
        local_host:  "localhost",
        remote_host: "localhost",
        upstream:    10*1024,
        downstream:  opts.speed * 1024,
        keepalive:   false
    };

    var serverOpts = {
        allowHalfOpen: true,
        rejectUnauthorized: false
    };
    var module = "net";
    var method = "createConnection";

    if (opts.key) {
        module = "tls";
        method = "connect";
        serverOpts.key = opts.key;
        serverOpts.cert = opts.cert;
    }

    return require(module).createServer(serverOpts, function (local) {

        var remote = require(module)[method]({
            host: opts.target.hostname,
            port: opts.target.port,
            allowHalfOpen: true,
            rejectUnauthorized: false
        });

        var upThrottle = new ThrottleGroup({ rate: options.upstream });
        var downThrottle = new ThrottleGroup({ rate: options.downstream });

        var localThrottle = upThrottle.throttle();
        var remoteThrottle = downThrottle.throttle();

        setTimeout(function () {
            local
                .pipe(localThrottle)
                .pipe(remote);
        }, opts.latency);

        setTimeout(function () {
            remote
                .pipe(remoteThrottle)
                .pipe(local);
        }, opts.latency);

        local.on("error", function() {
            remote.destroy();
            local.destroy();
        });

        remote.on("error", function() {
            local.destroy();
            remote.destroy();
        });
    });
}