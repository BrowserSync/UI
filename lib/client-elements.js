var fs = require("fs");

function enableElement (clients, cp, bs) {

    return function (clientScripts, file) {

        var item = bs.getOptionIn(["clientFiles", file.name]).toJS();

        if (!item.active) {

            bs.setOptionIn(["clientFiles", item.name, "active"], true, {silent: true});

            if (!item.served) {
                bs.setOptionIn(["clientFiles", item.name, "served"], true, {silent: true});
                bs.serveFile(item.src, {
                    type:    "text/css",
                    content: fs.readFileSync(item.file)
                });
            }

            addElement(clients, bs.getOptionIn(["clientFiles", item.name]).toJS());

            return clientScripts.set(item.name, item);
        }
        return clientScripts;
    }
}

/**
 * @param clients
 * @param cp
 * @param bs
 * @returns {Function}
 */
function disableElement (clients, cp, bs) {
    return function (clientScripts, file) {
        if (clientScripts.get(file.name)) {
            var item = bs.getOptionIn(["clientFiles", file.name]).toJS();
            bs.setOptionIn(["clientFiles", item.name, "active"], false, {silent: true});
            removeElement(clients, item.id);
            return clientScripts.remove(item.name);
        }
        return clientScripts;
    }
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

