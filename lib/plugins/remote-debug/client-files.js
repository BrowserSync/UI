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
    }
    //{
    //    type:    "css",
    //    context: "remote-debug",
    //    id:      "__browser-sync-basehold__",
    //    active:  false,
    //    file:    false,
    //    title:   "CSS basehold.it",
    //    served:  false,
    //    name:    "basehold",
    //    src:     "http://basehold.it/24",
    //    tagline: "A QUICK, PAINLESS, JAVASCRIPT-FREE BASELINE OVERLAY",
    //    hidden:  ""
    //}
];

module.exports.files = files;