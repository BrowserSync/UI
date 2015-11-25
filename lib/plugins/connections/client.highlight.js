(function (window, document, bs, undefined) {

    socket.on("highlight", function (connection) {

        var id = "__browser-sync-highlight__";
        var elem = document.getElementById(id);
        if (elem) {
            return removeElement(elem);
        }
        (function (e) {
            e.style.position = "fixed";
            e.style.zIndex = "500000";
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
})(window, document, ___browserSync___);