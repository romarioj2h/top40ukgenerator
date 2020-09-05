const util = require('util');

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

exports.insert = (service, auth, playlistId, videoId) => {
    console.log('inserting: ' + videoId);
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


exports.clean = async (service, auth, playlistId) => {
    let playlistItems = await get(service, auth, playlistId);
    for (const item of playlistItems.data.items) {
        await remove(service, auth, item.id);
    }
};