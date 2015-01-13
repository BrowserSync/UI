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

    socket.on("cp:element:remove", function (data) {
        if (data.id) {
            document.getElementById(data.id).remove();
        }
    });

    socket.on("cp:add:script", function (data) {
        if (data.src) {
            (function (e) {
                e.setAttribute("src", data.src);
                document.getElementsByTagName("body")[0].appendChild(e);
            })(document.createElement("script"));
        }
    });

    socket.on("cp:add:css", function (data) {
        if (data.src) {
            (function (e) {
                e.setAttribute("rel",  "stylesheet");
                e.setAttribute("type", "text/css");
                e.setAttribute("id",   data.id);
                e.setAttribute("media", "all");
                e.setAttribute("href", data.src);
                document.getElementsByTagName("head")[0].appendChild(e);
            })(document.createElement("link"));
        }
    });

})(window, document, ___browserSync___);