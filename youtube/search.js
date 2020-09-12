const util = require('util');
var topbugger = require('../topbugger.js');

exports.list = (service, auth, q, debug) => {
    const listService = util.promisify(service.search.list).bind(service.search);
    topbugger.debug(debug, 'Searching for youtube video for ' + q);
    return listService({
        auth: auth,
        part: 'snippet',
        type: 'video',
        q: q
    });
}