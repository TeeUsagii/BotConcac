module.exports.info = {
	name: "unsend",
	version: "1.0.1",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Gỡ tin nhắn của Bot",
        short: "Gỡ tin nhắn của Bot"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[Rep ly tin nhắn cần gỡ]',
	],
	countdown: 5
};

module.exports.handleEvents = function({ api, event }) {
	var { body, type } = event;
	if (type == "message_reply" && body == "." && event.messageReply.senderID == api.getCurrentUserID()) return api.unsendMessage(event.messageReply.messageID);
}

module.exports.run = function({ api, event }) {
	if (event.type != "message_reply") return api.sendMessage('Hãy reply tin nhắn cần gỡ.', event.threadID, event.messageID);
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage('Không thể gỡ tin nhắn của người khác.', event.threadID, event.messageID);
	return api.unsendMessage(event.messageReply.messageID);
}