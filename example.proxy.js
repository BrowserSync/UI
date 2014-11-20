var cp     = require("./index");
var bs     = require("browser-sync");

bs.use(cp);

bs({
    proxy: "swoon.static",
    open: false,
    port: 3000
});