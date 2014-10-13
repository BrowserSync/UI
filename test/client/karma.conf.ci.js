var ciConfig = require(__dirname + "/config");
ciConfig.singleRun = true;
module.exports = function (config) {
    ciConfig.logLevel  = config.LOG_WARN;
    ciConfig.autoWatch = false;
    ciConfig.singleRun = true;
    config.set(ciConfig);
};
