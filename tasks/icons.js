var easysvg     = require("easy-svg");

/**
 * Compile SVG Symbols
 */
function icons (obs, opts, ctx) {
    return ctx.vfs.src(opts.input)
        .pipe(easysvg.stream({js: false}))
        .on('error', obs.onError.bind(obs))
        .pipe(ctx.vfs.dest(opts.output))
        .on('end', obs.onCompleted.bind(obs));
}

module.exports.tasks = [icons];