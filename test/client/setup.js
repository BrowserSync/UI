/**
 * Global Mock for the socket
 * @type {{on: on, emit: emit}}
 * @private
 */
var ___browserSync___ = {
    socket: {
        on: function () {},
        removeListener: function () {},
        emit: function () {}
    }
};


/**
 * Global setup for testing
 */
var assert = chai.assert;