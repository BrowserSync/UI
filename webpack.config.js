var config = {
    context: __dirname + '/src/scripts',
    entry: [
        "./app.js"
    ],
    output: {
        path: __dirname + "/public",
        filename: "js/app.js"
    },
    watchOptions: {
        poll: true
    }
};

module.exports = config;