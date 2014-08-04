"use strict";

(function (window, socket, undefined) {

    socket.on('cp:goTo', function(data){
        window.location = data.url;
    });

    socket.on("options:set", function (data) {
        window.location.reload(true);
    });

})(window, ___socket___);