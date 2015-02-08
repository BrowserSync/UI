"use strict";

(function (window, document, bs, undefined) {

    var socket = bs.socket;

    socket.on("ui:connection", function () {

        bs.socket.emit("ui:history:connected", {
            href: window.location.href,
            location: window.location
        });

        window.setInterval(function () {
            socket.emit("client:heartbeat", {
                dimensions: {
                    width:  Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                }
            });
        }, 1000);
    });

    socket.on("ui:element:remove", function (data) {
        if (data.id) {
            var elem = document.getElementById(data.id);
            if (elem) {
                removeElement(elem);
            }
        }
    });

    socket.on("highlight", function () {
        var id = "__browser-sync-highlight__";
        var elem = document.getElementById(id);
        if (elem) {
            return removeElement(elem);
        }
        (function (e) {
            e.style.position = "fixed";
            e.style.zIndex = "1000";
            e.style.width = "100%";
            e.style.height = "100%";
            e.style.borderWidth = "5px";
            e.style.borderColor = "red";
            e.style.borderStyle = "solid";
            e.style.top = "0";
            e.style.left = "0";
            e.setAttribute("id", id);
            document.getElementsByTagName("body")[0].appendChild(e);
        })(document.createElement("div"));
    });

    socket.on("ui:element:add", function (data) {

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
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

})(window, document, ___browserSync___);