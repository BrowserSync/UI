var bs = require('browser-sync').create();

bs.init({
    server: ['react/public', 'public'],
    files: ['react/public/**']
});