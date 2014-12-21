/**
 * @type {angular}
 */
var app = require("../module");

app.factory("Options", ["Socket", OptionsService]);

/**
 * @param Socket
 * @constructor
 */
function OptionsService(Socket) {

    return {
        all: function () {
            return Socket.getData("options");
        }
    }
}