/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) { /* noop */},

    /**
     * Hooks
     */
    "hooks": {
        "markup": "<server-info ng-if=\"options\" options=\"options\"></server-info>",
        "client:js": require("fs").readFileSync(__dirname + "/server-info.client.js", "utf-8")
    },
    /**
     * Plugin name
     */
    "plugin:name": "Server Information"
};