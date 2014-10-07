var ciConfig = require(__dirname + "/config");
ciConfig.singleRun = true;
module.exports = function (config) {
    ciConfig.logLevel = config.LOG_WARN;
    config.set(ciConfig);
};
