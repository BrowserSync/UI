var path   = "/Users/shakyshane/sites/os-browser-sync";
var path   = "/Users/shakyshane/sites/os-browser-sync";
var bspath = "/Users/shaneobsourne/sites/browser-sync";

var cp     = require("./index");
var bs     = require(bspath);

bs.use(cp);

bs({
    proxy: "swoon.static",
    open: false,
    port: 3000
});