module.exports.info = {
	name: "ban",
	version: "1.0.2",
	permissions: 2,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Có thể cấm người dùng nào đó không thể sử dụng Bot cho đến khi được ân xá",
        short: "Cấm người dùng"
    },
	group: "Dành Cho Quản Lí",
	guide: [
		'[list/tag]',
	],
	countdown: 5
};

module.exports.handleMessageReply = async function({ api, event, multiple, Reply, Users, Cherry }) {
    var { banned, type, author } = Reply, { mentions, threadID, senderID, body, messageID } = event;
    if (author != senderID) return;
    var fullTime = Cherry.getTime("fullTime");
    api.unsendMessage(Reply.messageID);
    switch (type) {
        case "view":
            if (Object.keys(mentions).length == 0) return api.sendMessage(`Bạn cần tag những người trong danh sách để xem lí do bị ban của họ.`, threadID, messageID);
            var msg = '', number = 1;
            for (var i of Object.keys(mentions)) {
                for (var info of banned) {
                    if (i == info.ID) msg += `${number++}. ${info.name}: ${info.banned.lido.join(', ')}\n\nNgười ban: ${info.banned.author}\nNgày ban: ${info.banned.time}\n\n`
                }
            }
            return api.sendMessage(msg, threadID, messageID);
        default:
            if (!body) return api.sendMessage("Bạn cần nhập lí do.", threadID, messageID);
            var authorBan = await Users.getData(senderID), error = [], finish = 0;
            for (var i of Object.keys(banned)) {
                var bannedInfo = await Users.getData(i);
                if (bannedInfo.banned && bannedInfo.banned.status == true) {
                    bannedInfo.banned.lido.push(body);
                    await Users.setData(i, bannedInfo);
                    finish++;
                } else if (!bannedInfo.banned) {
                    bannedInfo.banned = { status: true, lido: [body], author: authorBan.name, type: type, time: fullTime };
                    await Users.setData(i, bannedInfo);
                    multiple.allUsersBanned.set(i);
                    finish++;
                } else error.push(i);
            }
            return api.sendMessage(`Đã ban thành công ${finish} thành viên.${error.length > 0 ? `\n\nCó đã xảy khi lỗi khi thực hiện với ${error.length} thành viên có ID: ${error.join(', ')}.` : ''}`, threadID)
    }
}

module.exports.run = async function({ api, event, multiple, args, Users }) {
    var { mentions, threadID, messageID, senderID } = event;
    var Ry = '100005548624106';
    if (args[0] == 'list') {
        var allUsers = await Users.getAll(['banned', 'name']);
        var banned = [], msg = "Danh sách thành viên đang bị Ban:\n\n", number = 0;
        for (var i of allUsers) {
            if (i.banned && i.banned.status == true) {
                banned.push({ 'ID': i.ID, 'name': i.name, 'banned': i.banned });
            }
        }
        if (banned.length == 0) return api.sendMessage('Hiện tại không có người dùng nào bị ban.', threadID);
        for (var i of banned) {
            number++;
            msg += `${number}. ${i.name} ${i.banned.type == 'superBan' ? 'ngậm ' + i.banned.type : 'bị ' + i.banned.type} từ ${i.banned.time}\n`
        }
        return api.sendMessage(`${msg}\nReply tin nhắn này tag kèm người có trong danh sách để xem lí do.`, threadID, (error, info) => {
            multiple.handleMessageReply.push({
                name: this.info.name,
                messageID: info.messageID,
                author: senderID,
                banned: banned,
                type: 'view'
            });
        }, messageID);
    }
    if (Object.keys(mentions).length == 0) return api.sendMessage("Bạn phải tag những người cần bạn!", threadID, messageID);
    var mention = Object.keys(mentions), msg = `Bạn có chắc muốn ban ${mention.length > 1 ? 'những người dưới đây' : 'thành viên dưới đây'}?\n\n`, number = 1;
    for (var [id, name] of Object.entries(mentions)) {
        if (id == Ry) {
            var userInfo = await Users.getData(senderID);
            userInfo.banned = {
                status: true,
                lido: "Ngáo đá ban Boss.",
                author: "Bot Protection",
                type: 'superBan'
            }
            await Users.setData(senderID, userInfo);
            return api.sendMessage("Bạn đã bị ban vì tội ngáo đá (Ban Boss).", threadID, messageID);
        }
        msg += `${number++}. ${name.replace("@", "")}\n`
    }
    msg += `\nVui lòng reply tin nhắn này với lí do bạn muốn ban những người trên.`;
    return api.sendMessage(msg, threadID, (error, info) => {
        multiple.handleMessageReply.push({
            name: this.info.name,
            messageID: info.messageID,
            author: senderID,
            banned: mentions,
            type: senderID == Ry ? 'superBan' : 'ban'
        });
    }, messageID);
}