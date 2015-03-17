var Immutable = require("immutable");
var fs = require("fs");

module.exports.init = function (ui) {

    var size    = "16px";
    var color   = "rgba(0, 0, 0, .2)";
    var optPath = ["remote-debug", "overlay-grid"];
    var baseHorizontal = fs.readFileSync(require("path").resolve(__dirname, "css/grid-overlay-horizontal.css"), "utf8");
    var baseVertical   = fs.readFileSync(require("path").resolve(__dirname, "css/grid-overlay-vertical.css"), "utf8");

    ui.clients.on("connection", function (client) {
        client.on("ui:remote-debug:css-overlay-grid:ready", function () {
            client.emit("ui:remote-debug:css-overlay-grid", {
                innerHTML: getCss(ui.options.getIn(optPath).toJS())
            });
        });
    });

    ui.setOptionIn(optPath, Immutable.Map({
        name: "overlay-grid",
        title: "Overlay CSS Grid",
        active: false,
        tagline: "Add an adjustable CSS overlay grid to your webpage",
        size: size,
        color: color,
        innerHTML: getCss(size),
        horizontal: true,
        vertical: true
    }));

    function getCss(opts) {
        var base = "body {position:relative;}";
        if (opts.horizontal) {
            base += baseHorizontal;
        }
        if (opts.vertical) {
            base += baseVertical;
        }
        return base
            .replace(/\{\{color\}\}/g, String(opts.color))
            .replace(/\{\{size\}\}/g, String(opts.size));
    }

    var methods = {
        toggle: function (value) {
            if (value !== true) {
                value = false;
            }
            if (value) {
                ui.setOptionIn(optPath.concat("active"), true);
                ui.enableElement({name: "overlay-grid-js"});
            } else {
                ui.setOptionIn(optPath.concat("active"), false);
                ui.disableElement({name: "overlay-grid-js"});
                ui.clients.emit("ui:element:remove", {id: "__bs_overlay-grid-styles__"});
            }
        },
        adjust: function (data) {
            size  = data.size;
            color = data.color;
            ui.setOptionIn(optPath.concat(["size"]), size);
            ui.setOptionIn(optPath.concat(["color"]), color);
            ui.clients.emit("ui:remote-debug:css-overlay-grid", {
                innerHTML: getCss(ui.options.getIn(optPath).toJS())
            });
        },
        "toggle:axis": function (item) {
            ui.setOptionIn(optPath.concat([item.axis]), item.value);
            ui.clients.emit("ui:remote-debug:css-overlay-grid", {
                innerHTML: getCss(ui.options.getIn(optPath).toJS())
            });
        },
        event: function (event) {
            methods[event.event](event.data);
        }
    };

    return methods;
};