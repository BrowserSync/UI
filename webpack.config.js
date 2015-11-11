// webpack.config.js
module.exports = {
    entry: __dirname + "/src/scripts/app.js",
    output: {
        context:  __dirname,
        filename: __dirname + "/public/js/app.js"
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