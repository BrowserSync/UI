var http        = require("http");
var fs          = require("fs");
var config      = require("./config");
var svg         = publicFile("/img/icons/svg/symbols.svg");
var indexPage   = publicFile(config.defaults.indexPage);
var header      = staticFile(config.defaults.components.header);
var footer      = staticFile(config.defaults.components.footer);

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
 * @param {ControlPanel} controlPanel
 * @param opts
 * @returns {*}
 */
function startServer(controlPanel, opts) {

    var connect     = controlPanel.bs.utils.connect;
    var serveStatic = controlPanel.bs.utils.serveStatic;

    /**
     * Create a connect server
     */
    var app = connect();

    /**
     * Serve JS files
     */
    serveJsFiles(app, opts.middleware.socket, opts.middleware.connector);

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
            .replace(/%footer%/g, footer)
    );

    /**
     * History API fallback
     */
    app.use(require("connect-history-api-fallback"));

    /**
     * Serve static directory
     */
    app.use(serveStatic(publicDir("")));

    /**
     * Development use
     */
    app.use("/node_modules", serveStatic(packageDir("node_modules")));

    /**
     * Create a single big file with all deps
     */
    serveAll(app, [
        fileContent("node_modules/angular/angular.min.js"),
        fileContent("node_modules/angular-route/angular-route.min.js"),
        fileContent("node_modules/angular-touch/angular-touch.min.js"),
        fileContent("node_modules/angular-sanitize/angular-sanitize.min.js"),
        fileContent("public/js/app.js"),
        controlPanel.pagesConfig,
        controlPanel.clientJs
    ].join(";"));

    // also serve for convenience
    serveFile(app, config.defaults.pagesConfig, controlPanel.pagesConfig);
    serveFile(app, config.defaults.clientJs,    controlPanel.clientJs);

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
 */
function serveJsFiles(app, socketMw, connectorMw) {
    app.use(config.defaults.socketJs, socketMw);
    app.use(config.defaults.connector, connectorMw);
}

/**
 * @param app
 * @param pages
 * @param markup
 */
function insertPageMarkupFromHooks(app, pages, markup) {

    app.use(function (req, res, next) {
        if (req.url === "/" || pages[req.url.slice(1)]) {
            res.setHeader("Content-Type", "text/html");
            res.end(markup);
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
    serveFile(app, config.defaults.app, all);
}

/**
 * Serve a JS
 * @param app
 * @param all
 */
function serveFile(app, path, string) {
    app.use(path, function (req, res) {
        res.setHeader("Content-Type", "application/javascript");
        res.end(string);
    });
}

module.exports = startServer;