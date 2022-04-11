module.exports.info = {
	name: "warn",
	version: "1.0.0",
	permissions: 2,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Cảnh cáo nhanh một thành viên bằng cách reply tin nhắn của họ. Người bị cảnh cáo 3 lần sẽ bị ban.",
        short: "Cảnh cáo thành viên"
    },
	group: "Dành Cho Quản Lí",
	guide: [
		'[tag]',
	],
	countdown: 5
};

module.exports.handleMessageReply = async function({ api, event, Reply, Users }) {
    var { threadID, senderID, messageID } = event;
    var { userID, list, type } = Reply;
    console.log(list)
    api.unsendMessage(Reply.messageID);
    switch (type) {
        case 'list':
            var { mentions } = event;
            if (Object.keys(mentions).length == 0) return api.sendMessage(`Bạn cần tag kèm người trong danh sách để xem chi tiết.`, threadID, messageID);
            var msg = '', number = 1;
            for (var [id, name] of Object.entries(mentions)) {
                if (list.some(item => item.ID == id)) {
                    var info = list.find(item => item.ID == id);
                    msg += `${number++}. ${info.name}: ${info.warn.lido.join(', ')}\n\n`
                } else api.sendMessage(`Người dùng ${name.replace("@", "")} không tồn tại trong danh sách.`, threadID, messageID);
            }
            return api.sendMessage(msg, threadID);
        case 'unwarn':
            if (senderID != userID) return api.sendMessage('Bạn không phải người gọi lệnh này.', threadID, messageID);
            var { mentions } = event;
            if (Object.keys(mentions).length == 0) return api.sendMessage(`Bạn cần tag kèm một người có trong danh sách để có thể unban cho họ.`, threadID, messageID);
            var msg = '', number = 1;
            for (var [id, name] of Object.entries(mentions)) {
                if (list.some(item => item.ID == id)) {
                    var data = await Users.getData(id);
                    delete data.warn;
                    await Users.setData(id, data);
                    msg += `${number++}. ${name.replace('@', '')} đã đượt xóa khỏi danh sách warn`;
                } else api.sendMessage(`Thành viên ${name.replace('@', '')} không tồn tại trong danh sách.`, threadID, messageID);
            }
            return api.sendMessage(msg, threadID);
        default:
            break;
    }
}

module.exports.run = async function({ api, event, args, Users, Cherry, multiple }) {
    var { threadID, senderID, messageID, messageReply } = event;
    if (!messageReply) {
        switch (args[0]) {
            case 'list':
                var allWarn = await Users.getAll(['warn', 'name']);
                var msg = 'Dưới đây là danh sách những người đã bị cảnh cáo:\n\n', stt = 1, list = [];
                for (var i of allWarn) {
                    if (i.warn && i.warn.total) {
                        msg += `${stt++}. ${i.name}\n`
                        list.push({ ID: i.ID, name: i.name, warn: i.warn });
                    }
                }
                if (list.length == 0) return api.sendMessage(`Hiện tại chưa có người dùng nào bị cảnh cáo cả.`, threadID, messageID);
                msg += `\nReply tin nhắn này tag kèm người có tên trong danh sách để xem chi tiết.`;
                return api.sendMessage(msg, threadID, (error, info) => {
                    multiple.handleMessageReply.push({
                        name: this.info.name,
                        messageID: info.messageID,
                        userID: senderID,
                        list: list,
                        type: 'list'
                    });
                }, messageID);
            case 'unwarn':
                var allWarn = await Users.getAll(['warn', 'name']);
                var msg = 'Dưới đây là danh sách những người bạn có thể unwarn cho họ:\n\n', stt = 1, list = [];
                for (var i of allWarn) {
                    if (i.warn && i.warn.total) {
                        msg += `${stt++}. ${i.name}\n`
                        list.push({ ID: i.ID, name: i.name, warn: i.warn });
                    }
                }
                if (list.length == 0) return api.sendMessage(`Hiện tại không có người dùng nào bị cảnh cáo cả.`, threadID, messageID);
                msg += `\nReply tin nhắn này tag kèm người có tên trong danh sách để unwarn.`;
                return api.sendMessage(msg, threadID, (error, info) => {
                    multiple.handleMessageReply.push({
                        name: this.info.name,
                        messageID: info.messageID,
                        userID: senderID,
                        list: list,
                        type: 'unwarn'
                    });
                }, messageID);
            default:
                break;
        }
        return api.sendMessage(`Bạn cần trả lời tin nhắn của người cần cảnh cáo.`, threadID, messageID);
    }
    if (args.length <= 0) return api.sendMessage(`Bạn cần nhập lí do cảnh cáo người này.`, threadID, messageID);
    var info = await Users.getData(messageReply.senderID);
    if (!info.warn) {
        await Users.setData(messageReply.senderID, { warn: { total: 1, lido: [args.join(' ')] } });
        return api.sendMessage(`Đã cảnh cáo ${info.name} lần 1 vì lí do: ${args.join(' ')}`, threadID);
    } else {
        info.warn.total++
        info.warn.lido.push(args.join(' '));
    }
    if (info.warn.total == 3) {
        var { name } = await Users.getData(senderID);
        var fullTime = Cherry.getTime('fullTime');
        info.banned = { status: true, lido: info.warn.lido, author: name, type: 'ban', time: fullTime };
        delete info.warn;
        await Users.setData(messageReply.senderID, info);
        return api.sendMessage(`${info.name} đã bị ban vì bị cảnh cáo 3 lần.`, threadID);
    }
    await Users.setData(messageReply.senderID, info);
    return api.sendMessage(`${info.name} đã bị cảnh cáo lần ${info.warn.total} vì lí do: ${args.join(' ')}`, threadID);
}
