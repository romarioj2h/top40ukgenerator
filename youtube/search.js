const util = require('util');

exports.list = (service, auth, q) => {
    const listService = util.promisify(service.search.list).bind(service.search);
    return listService({
        auth: auth,
        part: 'snippet',
        type: 'video',
        q: q
    });
}