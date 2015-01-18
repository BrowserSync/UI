var cp = require("./index");
var bs = require("browser-sync");

//var client = require("/Users/shaneobsourne/sites/browser-sync-client");
//
//client["plugin:name"] = "client:script";

bs.use(cp);
//bs.use(client);

bs({
    proxy: "http://www.bbc.co.uk",
    open: false,
    minify: false,
    snippetOptions: {

        // Provide a custom Regex for inserting the snippet.
        rule: {
            match: /<\/body>/i,
            fn: function (snigppet, match) {
                return snippet + match;
            }
        }
    }
    //tunnel: true
    //port: 3000
});