var utils = exports;

utils.normalizeRule = function (rule) {
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
    output.id   = rule.added;
    return output;
}