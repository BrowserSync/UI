var fs = require("fs");
var mime = require("mime");

const CLIENT_FILES_OPT = "clientFiles";

/**
 * Enable a element on clients
 * @param clients
 * @param ui
 * @param bs
 * @returns {Function}
 */

var types = {
    "css": "text/css",
    "js":  "application/javascript"
};

function enableElement (clients, ui, bs) {

    return function (file) {

        var uiItem   = ui.getOptionIn([CLIENT_FILES_OPT, file.name]);
        var item     = uiItem.toJS();
        var enableFn = uiItem.getIn(["callbacks", "enable"]);

        if (item.active) {
            return;
        }

        ui.setOptionIn([CLIENT_FILES_OPT, item.name, "active"], true, {silent: true});

        if (enableFn) {
            enableFn.call(ui, item);
        }

        if (item.file && !item.served) {

            ui.setOptionIn([CLIENT_FILES_OPT, item.name, "served"], true, {silent: true});

            bs.plugin('option:middleware', function (mw) {
                var content = fs.readFileSync(item.file);
                var mimetype = mime.lookup(item.type);
                return mw.concat({
                    id: 'ui-serve-file-' + item.id,
                    route: item.src,
                    handle: function (req, res) {
                        res.setHeader("Content-Type", mimetype);
                        res.end(content);
                    }
                })
            });
        }

        addElement(clients, ui.getOptionIn([CLIENT_FILES_OPT, item.name]).toJS());
    };
}

/**
 * @param clients
 * @param ui
 * @returns {Function}
 */
function disableElement (clients, ui) {

    return function (file) {
        var uiItem    = ui.getOptionIn([CLIENT_FILES_OPT, file.name]);
        var item      = uiItem.toJS();
        var disableFn = uiItem.getIn(["callbacks", "disable"]);

        if (disableFn) {
            disableFn.call(ui, item);
        }

        ui.setOptionIn([CLIENT_FILES_OPT, item.name, "active"], false, {silent: true});

        ui.bs.plugin('middleware', function (mw) {
            return mw.filter(function (mwItem) {
                return mwItem.id === 'ui-serve-file-' + item.id;
            });
        });

        removeElement(clients, item.id);
    };
}

/**
 * @param clients
 * @param item
 */
function addElement (clients, item) {

    clients.emit("ui:element:add", item);
}

/**
 * @param clients
 * @param id
 */
function removeElement(clients, id) {

    clients.emit("ui:element:remove", {id: id});
}

module.exports.addElement    = addElement;
module.exports.removeElement = removeElement;
module.exports.enable        = enableElement;
module.exports.disable       = disableElement;

