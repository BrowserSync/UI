"use strict";

(function (window, socket, undefined) {

    socket.on('cp:goTo', function(data){
        window.location = data.url;
    });

})(window, ___socket___);