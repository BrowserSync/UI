module.exports = function (ptor, config) {

    var flow = ptor.promise.controlFlow();
    var deferred = ptor.promise.defer();

    var bs = require("browser-sync").create("Test Instance");

    bs.use(require("../../../"));

    return flow.execute(function () {

        bs.init(config, function (err, _bs) {
            _bs.pluginManager.getReturnValues("UI")[0].value
                .getServer(function (err, server) {
                    deferred.fulfill({
                        port: server.address().port,
                        bs: bs
                    });
                });
        });

        return deferred.promise;
    });
};