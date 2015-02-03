var Immutable = require("immutable");

module.exports.init = function (ui, bs) {

    var timeout = 0;
    var optPath = ["remote-debug", "latency"];

    ui.setOptionIn(optPath, Immutable.Map({
        name: "latency",
        title: "Latency",
        active: false,
        tagline: "Simulate slower connections by throttling each request.",
        rate: 0
    }));

    return {
        toggle: function (value) {
            if (value !== true) {
                value = false;
            }
            if (value) {
                ui.setOptionIn(optPath.concat("active"), true);
                bs.addMiddleware("*", function (req, res, next) {
                    setTimeout(next, timeout);
                }, {id: "cp-latency", override: true});
            } else {
                ui.setOptionIn(optPath.concat("active"), false);
                bs.removeMiddleware("cp-latency");
            }
        },
        adjust: function (value) {
            timeout = parseFloat(value) * 1000;
        },
        save: function () {
            var saved = ui.options.getIn(optPath.concat("rate"));
            if (saved !== timeout/1000) {
                ui.setOptionIn(optPath.concat("rate"), timeout/1000);
                console.log(ui.options.getIn(optPath.concat("rate")));
            }
        }
    }
};