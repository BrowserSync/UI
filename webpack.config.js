// webpack.config.js
module.exports = {
    entry: __dirname + "/src/cycle/index.js",
    output: {
        context:  __dirname,
        filename: __dirname + "/public/js/app.cycle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};