const util = require('util');

if (!util.promisifyMethod) {
    util.promisifyMethod = function (fn, obj) {
        return util.promisify(fn).bind(obj);
    }
}

function getPlaylistItems(service, auth, playlistId) {
    const listService = util.promisifyMethod(service.playlistItems.list, service.playlistItems);
    return listService({
        auth: auth,
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50
    });
}

function deletePlaylistItem(service, auth, itemId) {
    const deleteService = util.promisifyMethod(service.playlistItems.delete, service.playlistItems);
    return deleteService({
        auth: auth,
        id: itemId
    });
}

exports.delete = async (service, auth, playlistId) => {
    let playlistItems = await getPlaylistItems(service, auth, playlistId);
    for (const item of playlistItems.data.items) {
        await deletePlaylistItem(service, auth, item.id);
    }
};