"use strict";

(function (window, bs, undefined) {

    bs.socket.on("options:set", function (data) {
        window.setTimeout(function () {
            window.location.reload(true);
        }, 300);
    });

    bs.socket.on("connection", function () {
        bs.socket.emit("urls:client:connected", {
            path: window.location.href
        });
    });

})(window, ___browserSync___);