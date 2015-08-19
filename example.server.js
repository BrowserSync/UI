var bs = require('browser-sync').create();
bs.use(require('./'));

bs.init({
    server: 'test/fixtures',
    open: false
});