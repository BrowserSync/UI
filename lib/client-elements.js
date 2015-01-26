var fs = require("fs");

/**
 * Enable a element on clients
 * @param clients
 * @param ui
 * @param bs
 * @returns {Function}
 */
function enableElement (clients, ui, bs) {

    return function (clientScripts, file) {

        var item = ui.getOptionIn(["clientFiles", file.name]).toJS();

        if (!item.active) {

            ui.setOptionIn(["clientFiles", item.name, "active"], true, {silent: true});

            if (!item.served) {
                ui.setOptionIn(["clientFiles", item.name, "served"], true, {silent: true});
                bs.serveFile(item.src, {
                    type:    "text/css",
                    content: fs.readFileSync(item.file)
                });
            }

            addElement(clients, ui.getOptionIn(["clientFiles", item.name]).toJS());

            return clientScripts.set(item.name, item);
        }

        return clientScripts;
    };
}

/**
 * @param clients
 * @param ui
 * @param bs
 * @returns {Function}
 */
function disableElement (clients, ui, bs) {

    return function (immMap, file) {

        if (immMap.get(file.name)) {

            var item = ui.getOptionIn(["clientFiles", file.name]).toJS();
            ui.setOptionIn(["clientFiles", item.name, "active"], false, {silent: true});
            removeElement(clients, item.id);
            return immMap.remove(item.name);
        }

        return immMap;
    };
}

/**
 * @param clients
 * @param item
 */
function addElement (clients, item) {

    clients.emit("cp:element:add", item);
}

/**
 * @param clients
 * @param id
 */
function removeElement(clients, id) {

    clients.emit("cp:element:remove", {id: id});
}

module.exports.addElement    = addElement;
module.exports.removeElement = removeElement;
module.exports.enable        = enableElement;
module.exports.disable       = disableElement;

