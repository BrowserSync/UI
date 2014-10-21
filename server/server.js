var _           = require("lodash");
var connect     = require("connect");
var through     = require("through");
var http        = require("http");
var fs          = require("fs");
var serveStatic = require("serve-static");

module.exports = startServer;

function startServer(controlPanel, socketMw, connectorMw) {

    var app = connect();
    
    serveTemplates(controlPanel.templates, app);
    
    app.use("/js/vendor/socket.js", socketMw);
    app.use("/js/connector", connectorMw);
    app.use("/js/app.js", function (req, res, next) {
        res.setHeader("Content-Type", "application/javascript");
        res.end(controlPanel.clientJs);
    });
    app.use(function (req, res, next) {
        if (req.url === "/") {
            res.setHeader("Content-Type", "text/html");
            return fs.createReadStream(__dirname + "/../lib/index.html")
                .pipe(through(function (buffer) {
                    var file = buffer.toString();
                    this.queue(file.replace(/%hooks%/g, controlPanel.pageMarkup));
                }))
                .pipe(res);
        } else {
            next();
        }
    });
    app.use(serveStatic(__dirname + "/../lib"));
    return http.createServer(app);
}

/**
 * 
 * @param controlPanel
 * @param app
 */
function serveTemplates(templates, app) {
    _.each(templates, function (template, path) {
        app.use("/" + path, function (req, res, next) {
            res.setHeader("Content-Type", "text/html");
            res.end(template);
        });
    });
}