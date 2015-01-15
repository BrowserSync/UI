"use strict";

(function (window, document, bs, undefined) {

    var socket = bs.socket;

    socket.on("connection", function (options) {
        bs.socket.emit("urls:client:connected", {
            href: window.location.href,
            location: window.location
        });
        window.setInterval(function () {
            socket.emit("client:heartbeat", {
                browser: {
                    width:  Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                }
            });
        }, 1000);
    });

    socket.on("cp:element:remove", function (data) {
        if (data.id) {
            var elem = document.getElementById(data.id);
            if (elem) {
                removeElement(elem);
            }
        }
    });

    socket.on("cp:element:add", function (data) {

        var elem = document.getElementById(data.id);

        if (!elem) {
            if (data.type === "css") {
                addCss(data);
            }
            if (data.type === "js") {
                addJs(data);
            }
        }
    });

    socket.on("cp:add:script", function (data) {
        if (data.src) {
            addJs(data);
        }
    });

    socket.on("cp:add:css", function (data) {
        if (data.src) {
            addCss(data);
        }
    });

    function addJs(data) {
        (function (e) {
            e.setAttribute("src", data.src);
            e.setAttribute("id", data.id);
            document.getElementsByTagName("body")[0].appendChild(e);
        })(document.createElement("script"));
    }

    function addCss(data) {
        (function (e) {
            e.setAttribute("rel",  "stylesheet");
            e.setAttribute("type", "text/css");
            e.setAttribute("id",   data.id);
            e.setAttribute("media", "all");
            e.setAttribute("href", data.src);
            document.getElementsByTagName("head")[0].appendChild(e);
        })(document.createElement("link"));
    }

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }

})(window, document, ___browserSync___);