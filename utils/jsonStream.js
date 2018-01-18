const through = require('through');

module.exports = {
    stringify(transform, stringify) {
        return (op, sep, cl, indent) =>
            stringifyData(typeof transform === 'function' ? transform : () => {}, stringify,
                op, sep, cl, indent);
    }
};

function stringifyData(transform, stringify, op, sep, cl, indent) {
    indent = indent || 0;
    if (op === false) {
        op = '';
        sep = '\n';
        cl = '';
    } else if (op == null) {
        op = '[\n';
        sep = '\n,\n';
        cl = '\n]\n';
    }
    stringify = stringify || (data => JSON.stringify(data, null, indent));
    let stream;
    let first = true;
    let anyData = false;
    stream = through(data => {
        anyData = true;
        let string;
        try {
            transform(data);
            string = stringify(data);
        } catch (err) {
            return stream.emit('error', err);
        }
        if (first) {
            first = false;
            stream.queue(op + string);
        } else stream.queue(sep + string);
    }, () => {
        if (!anyData) {
            stream.queue(op);
        }
        stream.queue(cl);
        stream.queue(null);
    });
    return stream;
}