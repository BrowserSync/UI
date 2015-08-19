var crossbow = require('crossbow');

function crossbowBuild (obs, opts, ctx) {
    ctx.vfs.src(opts.input.map(ctx.resolve))
        .pipe(crossbow.stream(opts.config))
        .pipe(ctx.vfs.dest(opts.output))
        .on("end", obs.onCompleted.bind(obs))
        .on('error', obs.onError.bind(obs));
}

module.exports.tasks = [crossbowBuild];