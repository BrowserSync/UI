"use strict";

(function (window, document, bs, undefined) {

    var socket = bs.socket;

    socket.on("options:set", function (data) {
        window.setTimeout(function () {
            window.location.reload(true);
        }, 300);
    });

    socket.on("connection", function () {
        bs.socket.emit("urls:client:connected", {
            path: window.location.href
        });
    });

    socket.on("cp:add:script", function (data) {
        if (data.src) {
            console.log(data);
            (function (e) {
                e.setAttribute("src", data.src);
                document.getElementsByTagName("body")[0].appendChild(e);
            })(document.createElement("script"));
        }
    });

})(window, document, ___browserSync___);