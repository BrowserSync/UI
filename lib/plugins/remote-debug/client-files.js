var files = [
    {
        name: "weinre",
        context: "remote-debug",
        active: false,
        title: "Remote Debugger (weinre)",
        tagline: "",
        hidden: "<a href=\"%s\" target=\"_blank\">Access remote debugger (opens in a new tab)</a></p>"
    },
    {
        type: "css",
        context: "remote-debug",
        id: "__browser-sync-pesticide__",
        active: false,
        file: __dirname + "/css/pesticide.min.css",
        title: "CSS Outlining",
        served: false,
        name: "pesticide",
        src: "/browser-sync/pesticide.css",
        tagline: "Add simple CSS outlines to all elements. (powered by <a href=\"http://pesticide.io\" target=\"_blank\">Pesticide.io</a>)",
        hidden: ""
    },
    {
        type: "css",
        context: "remote-debug",
        id: "__browser-sync-pesticidedepth__",
        active: false,
        file: __dirname + "/css/pesticide-depth.css",
        title: "CSS Depth Outlining",
        served: false,
        name: "pesticide-depth",
        src: "/browser-sync/pesticide-depth.css",
        tagline: "Add CSS box-shadows to all elements. (powered by <a href=\"http://pesticide.io\" target=\"_blank\">Pesticide.io</a>)",
        hidden: ""
    },
    //{
    //    type: "css",
    //    context: "na",
    //    id: "__browser-sync-overlay__",
    //    active: false,
    //    file: __dirname + "/css/grid-overlay.css",
    //    title: "CSS Overlay Grid",
    //    served: false,
    //    name: "overlay-grid",
    //    src: "/browser-sync/grid-overlay.css",
    //    tagline: "Add a CSS overlay grid",
    //    hidden: require("fs").readFileSync(__dirname + "/overlay-grid.html", "utf8"),
        //callbacks: {
        //    enable: function () {
        //        var ui = this;
        //        ui.enableElement({name: "overlay-grid-js"});
        //    },
        //    disable: function () {
        //        var ui = this;
        //    }
        //}
    //},
    {
        type:    "js",
        context: "n/a",
        id:      "__browser-sync-gridoverlay__",
        active:  false,
        file:    __dirname + "/js/grid-overlay.js",
        served:  false,
        name:    "overlay-grid-js",
        src:     "/browser-sync/grid-overlay-js.js"
    }
];

module.exports.files = files;