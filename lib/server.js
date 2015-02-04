var http        = require("http");
var fs          = require("fs");
var config      = require("./config");
var svg         = publicFile(config.defaults.public.svg);
var indexPage   = publicFile(config.defaults.indexPage);
var css         = publicFile(config.defaults.public.css);
var header      = staticFile(config.defaults.components.header);
var footer      = staticFile(config.defaults.components.footer);
var zlib        = require("zlib");

/**
 * CWD directory helper for static dir
 * @param {String|undefined} [path]
 * @returns {string}
 */
function publicDir (path) {
    return __dirname + "/../public" + path || "";
}

/**
 * @param path
 * @returns {string|string}
 */
function staticDir (path) {
    return __dirname + "/../static" + path || "";
}

/**
 * @param path
 * @returns {*}
 */
function publicFile(path) {
    return fs.readFileSync(publicDir(path), "utf-8");
}

/**
 * @param path
 * @returns {*}
 */
function staticFile(path) {
    return fs.readFileSync(staticDir(path), "utf-8");
}

/**
 * @param path
 * @returns {string}
 */
function packageDir (path) {
    return __dirname + "/../" + path;
}

/**
 * @param {UI} controlPanel
 * @param opts
 * @returns {*}
 */
function startServer(controlPanel) {

    var connect     = controlPanel.bs.utils.connect;
    var serveStatic = controlPanel.bs.utils.serveStatic;

    /**
     * Create a connect server
     */
    var app = connect();
    var allJS       = getClientJs(controlPanel);
    var jsFilename  = "/" + md5(allJS, 10) + ".js";
    var cssFilename = "/" + md5(css, 10)   + ".css";

    /**
     * Create a single big file with all deps
     */
    app.use(serveFile(jsFilename, "js", allJS));

    // also serve for convenience/testing
    app.use(serveFile(config.defaults.pagesConfig, "js", controlPanel.pagesConfig));
    app.use(serveFile(config.defaults.clientJs, "js",    controlPanel.clientJs));

    /**
     * Add any markup from plugins/hooks/templates
     */
    insertPageMarkupFromHooks(
        app,
        controlPanel.pages,
        indexPage
            .replace("%pageMarkup%", controlPanel.pageMarkup)
            .replace("%templates%", controlPanel.templates)
            .replace("%svg%", svg)
            .replace("%header%", header)
            .replace(/%footer%/g, footer) // multiple footers
            .replace("%appjs%", jsFilename)
            .replace("%appcss%", cssFilename)
    );

    /**
     * gzip css
     */
    app.use(serveFile(cssFilename, "css", css));

    /**
     * all public dir as static
     */
    app.use(serveStatic(publicDir("")));

    /**
     * History API fallback
     */
    app.use(require("connect-history-api-fallback"));

    /**
     * Development use
     */
    app.use("/node_modules", serveStatic(packageDir("node_modules")));

    /**
     * Return the server.
     */
    return {
        server: http.createServer(app),
        app: app
    };
}

/**
 * @param path
 * @returns {*}
 */
function fileContent (path) {
    return fs.readFileSync(__dirname + "/../" + path, "utf8");
}

/**
 * @param app
 * @param pages
 * @param markup
 */
function insertPageMarkupFromHooks(app, pages, markup) {

    var cached;

    app.use(function (req, res, next) {

        if (req.url === "/" || pages[req.url.slice(1)]) {
            res.writeHead(200, {"Content-Type": "text/html", "Content-Encoding": "gzip"});
            if (!cached) {
                var buf = new Buffer(markup, "utf-8");
                zlib.gzip(buf, function (_, result) {
                    cached = result;
                    res.end(result);
                });
            } else {
                res.end(cached);
            }
        } else {
            next();
        }
    });
}

/**
 * Serve Gzipped files & cache them
 * @param app
 * @param all
 */
var gzipCache = {};
function serveFile(path, type, string) {
    var typemap = {
        js:  "application/javascript",
        css: "text/css"
    };
    return function (req, res, next) {
        if (req.url !== path) {
            return next();
        }

        res.writeHead(200, {
            "Content-Type": typemap[type],
            "Content-Encoding": "gzip",
            "Cache-Control": "public, max-age=2592000000",
            "Expires": new Date(Date.now() + 2592000000).toUTCString()
        });

        if (gzipCache[path]) {
            return res.end(gzipCache[path]);
        }
        var buf = new Buffer(string, "utf-8");
        zlib.gzip(buf, function (_, result) {
            gzipCache[path] = result;
            res.end(result);
        });
    };
}

/**
 * @param cp
 * @returns {string}
 */
function getClientJs (cp) {
    return [
        cp.bs.getSocketIoScript(),
        cp.bs.getExternalSocketConnector({namespace: "/browser-sync-cp"}),
        fileContent("node_modules/angular/angular.min.js"),
        fileContent("node_modules/angular-route/angular-route.min.js"),
        fileContent("node_modules/angular-touch/angular-touch.min.js"),
        fileContent("node_modules/angular-sanitize/angular-sanitize.min.js"),
        fileContent("public/js/app.js"),
        cp.pagesConfig,
        cp.clientJs
    ].join(";");
}

/**
 * @param src
 * @param length
 */
function md5(src, length) {
    var crypto = require("crypto");
    var hash   = crypto.createHash("md5").update(src, "utf8").digest("hex");
    return hash.slice(0, length);
}

module.exports = startServer;