var utils = exports;
var counter = 0;

utils.normalizeRuleForBs = function (rule) {
    var output = {};
    if (rule.match.type === 'regex') {
        output.match = new RegExp(rule.match.input, 'g');
    } else {
        output.match = rule.match.input;
    }
    if (rule.replace.type === 'function') {
        output.fn = new Function(rule.replace.input);
    } else {
        output.fn = rule.replace.input;
    }
    return output;
}

utils.addId = function (item) {
    counter += 1;
    if (!item.id) {
        item.id = 'rewrite-' + counter;
    }
    return item;
}