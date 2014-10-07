var localConfig = require(__dirname + "/config");
localConfig.singleRun = false;
module.exports = function (config) {
    localConfig.logLevel = config.LOG_WARN;
    config.set(localConfig);
};
