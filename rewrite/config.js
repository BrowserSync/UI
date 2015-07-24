var config = exports;

config.PLUGIN_USER  = "shakyshane";
config.PLUGIN_NAME  = "Rewrite Rules";
config.PLUGIN_SLUG  = "rewrite-rules";
config.OPT_PATH     = [config.PLUGIN_USER, config.PLUGIN_SLUG];
config.NS           = config.OPT_PATH.join(":");
config.EVENT_UPDATE = [config.PLUGIN_USER, config.PLUGIN_SLUG, 'updated'].join(":");

module.exports = config;