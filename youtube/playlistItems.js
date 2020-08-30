const util = require('util');

if (!util.promisifyMethod) {
    util.promisifyMethod = function (fn, obj) {
        return util.promisify(fn).bind(obj);
    }
}

function get(service, auth, playlistId) {
    const listService = util.promisifyMethod(service.playlistItems.list, service.playlistItems);
    return listService({
        auth: auth,
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50
    });
}

function remove(service, auth, itemId) {
    const deleteService = util.promisifyMethod(service.playlistItems.delete, service.playlistItems);
    return deleteService({
        auth: auth,
        id: itemId
    });
}

exports.insert = (service, auth, videoId) => {
    console.log('inserting: ' + videoId);
    const insertService = util.promisifyMethod(service.playlistItems.insert, service.playlistItems);
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


exports.clean = async (service, auth, playlistId) => {
    let playlistItems = await get(service, auth, playlistId);
    for (const item of playlistItems.data.items) {
        await remove(service, auth, item.id);
    }
};