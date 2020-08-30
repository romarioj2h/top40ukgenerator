const util = require('util');

if (!util.promisifyMethod) {
    util.promisifyMethod = function (fn, obj) {
        return util.promisify(fn).bind(obj);
    }
}

exports.list = (service, auth, q) => {
    const listService = util.promisifyMethod(service.search.list, service.search);
    return listService({
        auth: auth,
        part: 'snippet',
        type: 'video',
        q: q
    });
}