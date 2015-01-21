var Immutable = require("immutable");

/**
 * Any configurable paths/config
 * @type {{pluginName: string, indexPage: string, socketJs: string, appJs: string, connector: string}}
 */
var defaults = {
    pluginName:  "UI",
    indexPage:   "/index.html",
    socketJs:    "/js/vendor/socket.js",
    appJs:       "/js/dist/app.js",
    app:         "/app.js",
    appExtraJs:  "/js/app-extra.js",
    connector:   "/js/connector.js",
    pagesConfig: "/js/pages-config.js",
    appCss:      "/css/core.css",
    clientJs:    "/lib/js/includes/events.js",
    socket: {
        namespace: "/browser-sync-cp"
    },
    components: {
        header: "/_components/top-bar.html",
        footer: "/_components/footer.html"
    }
};

module.exports.defaults = defaults;

/**
 * @param [userConfig]
 * @returns {Map}
 */
module.exports.merge    = function (userConfig) {
    return Immutable
        .fromJS(defaults)
        .mergeDeep(userConfig);
};