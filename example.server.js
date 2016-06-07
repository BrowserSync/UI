var bs = require('browser-sync').create();

bs.use(require('./'));

bs.init({
    server: 'test/fixtures',
    open: false,
    // plugins: ['bs-latency', 'bs-fullscreen-message', 'bs-console-info', 'bs-rewrite-rules', 'bs-html-injector']
    plugins: [
        {
            module: {
                plugin: function () {

                },
                "plugin:name": "Test Plugin"
            }
        }
    ]
});
