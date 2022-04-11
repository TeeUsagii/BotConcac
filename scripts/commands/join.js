module.exports.info = {
	name: "join",
	version: "1.0.1",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem & tham gia tất cả các nhóm đang có mặt Bot",
        short: "Xem & tham gia nhóm"
    },
	group: "System",
	guide: [
		'',
	],
	countdown: 5
};

module.exports.handleMessageReply = async ({ event, api, Reply, Threads }) => {
    var { threadID, messageID, body, senderID } = event;
    var { ID } = Reply;
    api.unsendMessage(Reply.messageID);
    if (!body || !parseInt(body)) return api.sendMessage('Lựa chọn của bạn phải là một số.', threadID, messageID);
    if ((parseInt(body) - 1) > ID.length) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", threadID, messageID);
    else {
        try {
            var threadInfo = await Threads.getInfo(ID[body - 1]);
            var { participantIDs } = threadInfo;
            if (participantIDs.includes(senderID)) return api.sendMessage('Bạn đã có mặt trong nhóm này.', threadID, messageID);
            api.addUserToGroup(senderID, ID[body - 1]);
            return api.sendMessage(`Cherry đã thêm bạn vào nhóm ${threadInfo.name} rồi nka. Kiểm tra ở mục spam hoặc tin nhắn chờ nếu không thấy box nka.`, threadID)
        } catch (error) {
            return api.sendMessage(`:( Em bị lỗi: ${error}`, threadID, messageID)
        }
    }
}

module.exports.run = async function({ api, event, Threads, multiple }) {
    var { threadID, messageID } = event;
    var allThreads = await Threads.getAll(['name']), ID = [], msg = `Danh sách tất cả các box bạn có thể tham gia:\n\n`, number = 0;
    for (var i of allThreads) {
        number++;
        msg += `${number}. ${i.name}\n`;
        ID.push(i.ID)
    }
    msg += `\nReply tin nhắn này kèm số tương ứng với box mà bạn muốn vào.`;
    return api.sendMessage(msg, threadID, (error, info) => {
        multiple.handleMessageReply.push({
            name: this.info.name,
            messageID: info.messageID,
            ID: ID
        })
    }, messageID);
}