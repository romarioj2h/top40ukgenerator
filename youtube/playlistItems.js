const util = require('util');
var topbugger = require('../topbugger.js');

function get(service, auth, playlistId) {
    const listService = util.promisify(service.playlistItems.list).bind(service.playlistItems);
    return listService({
        auth: auth,
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50
    });
}

function remove(service, auth, itemId) {
    const deleteService = util.promisify(service.playlistItems.delete).bind(service.playlistItems);
    return deleteService({
        auth: auth,
        id: itemId
    });
}

exports.insert = (service, auth, playlistId, videoId, debug) => {
    topbugger.debug(debug, 'Inserting video id ' + videoId + ' in the playlist');
    const insertService = util.promisify(service.playlistItems.insert).bind(service.playlistItems);
    return insertService({
        auth: auth,
        part: 'snippet',
        mine: true,
        resource: {
            snippet: {
                playlistId: playlistId,
                resourceId: {
                    kind: "youtube#video",
                    videoId: videoId
                }
            }
        }
    });
}

exports.clean = async (service, auth, playlistId, debug) => {
    topbugger.debug(debug, 'Start cleaning playlist');
    let playlistItems = await get(service, auth, playlistId);
    for (const item of playlistItems.data.items) {
        await remove(service, auth, item.id);
        topbugger.debug(debug, 'Removing ' + item.id + ' from playlist');
    }
    topbugger.debug(debug, 'Last item removed');
};