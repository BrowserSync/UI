var connect     = require("connect");
var through     = require("through");
var http        = require("http");
var fs          = require("fs");
var serveStatic = require("serve-static");

var config      = require("./config");

/**
 * CWD directory helper for static dir
 * @param {String|undefined} [path]
 * @returns {string}
 */
var libDir = function (path) {
    return __dirname + "/../lib" + path || "";
};

var packageDir = function (path) {
    return __dirname + "/../" + path;
};

/**
 * @param {ControlPanel} controlPanel
 * @param {Function} socketMw
 * @param {Function} connectorMw
 * @returns {*}
 */
function startServer(controlPanel, socketMw, connectorMw) {

    /**
     * Create a connect server
     */
    var app = connect();

    /**
     * Serve JS files
     */
    serveJsFiles(app, socketMw, connectorMw);

    /**
     * Add any markup from plugins/hooks
     */
    insertPageMarkupFromHooks(app, controlPanel.pageMarkup, controlPanel.pages, controlPanel.templates);

    /**
     * History API fallback
     */
    app.use(require("connect-history-api-fallback"));

    /**
     * Serve static directory
     */
    app.use(serveStatic(libDir("")));

    /**
     * Development use
     */
    app.use("/node_modules", serveStatic(packageDir("node_modules")));

    /**
     * Create a big file with all deps
     */
    serveAll(app, [
        fileContent("node_modules/angular/angular.min.js"),
        fileContent("node_modules/angular-route/angular-route.min.js"),
        fileContent("node_modules/angular-touch/angular-touch.min.js"),
        fileContent("node_modules/angular-sanitize/angular-sanitize.min.js"),
        fileContent("lib/js/dist/app.js"),
        controlPanel.pagesConfig,
        controlPanel.clientJs
    ].join(";"));
    /**
     * Return the server.
     */
    return {
        server: http.createServer(app),
        app: app
    };
}

function fileContent (path) {
    return fs.readFileSync(__dirname + "/../" + path, "utf8");
}

/**
 * @param {Connect} app
 * @param {Function} socketMw
 * @param {Function} connectorMw
 * @param {ControlPanel} controlPanel
 */
function serveJsFiles(app, socketMw, connectorMw) {
    app.use(config.defaults.socketJs, socketMw);
    app.use(config.defaults.connector, connectorMw);
}

/**
 * @param res
 * @param pageMarkup
 * @returns {*}
 */
function combineMarkup(res, pageMarkup) {
    res.setHeader("Content-Type", "text/html");
    return fs.createReadStream(libDir(config.defaults.indexPage))
        .pipe(through(function (buffer) {
            var file = buffer.toString();
            this.queue(file.replace(/%hooks%/g, pageMarkup));
        }))
        .pipe(res);
}

/**
 * @param app
 * @param pageMarkup
 */
function insertPageMarkupFromHooks(app, pageMarkup, pages, templates) {

    app.use(function (req, res, next) {
        if (req.url === "/" || pages[req.url.slice(1)]) {
            return combineMarkup(res, pageMarkup + templates);
        } else {
            next();
        }
    });
}

/**
 * Serve the entire JS + deps
 * @param app
 * @param all
 */
function serveAll(app, all) {
    app.use(config.defaults.app, function (req, res) {
        res.setHeader("Content-Type", "application/javascript");
        res.end(all);
    });
}

module.exports = startServer;