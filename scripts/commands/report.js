module.exports.info = {
	name: "report",
	version: "1.0.0",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Gửi report lỗi cho ADMIN Bot",
        short: "Report lỗi"
    },
	group: "Khác",
	guide: [
		'',
	],
	countdown: 5
};

module.exports.handleMessageReply = async function({ api, event, Cherry, multiple, Users, Reply, Threads }) {
    var { fromthreadID, type } = Reply;
    var { threadID, senderID, body, messageID } = event;
    switch (type) {
        case "userReport":
            var adminInfo = await Users.getData(senderID);
            var threadInfo = await Threads.getData(threadID);
            var msg = "====📨️ Phản Hồi Từ ADMIN 📨️====\n\n" +
            `Nội Dung: ${body}\n\n` +
            `Từ: ${adminInfo.name} - ${threadInfo.name}\n\n______________________________\nReply tin nhắn này để tiếp tục gửi report cho admin.`
            api.sendMessage(msg, fromthreadID, (error, info) => {
                if (error) return api.sendMessage("Đã xảy ra lỗi khi gửi phản hồi của bạn.", threadID, messageID);
                api.sendMessage("Đã gửi report của bạn thành công.", threadID, messageID);
                multiple.handleMessageReply.push({
                    name: this.info.name,
                    messageID: info.messageID,
                    userID: senderID,
                    fromthreadID: threadID,
                    type: 'adminReply'
                })
            });
            break;
        case "adminReply":
            var userData = await Users.getData(senderID);
            var threadData = await Threads.getData(threadID);
            var msg = "====📨️ Report 📨️====\n\n" +
            `Nội Dung: ${body}\n\n` +
            `Từ: ${userData.name}\nNhóm: ${threadData.name}\n\n______________________________\nReply tin nhắn này kèm nội dung để phản hồi lại cho người dùng.`
            api.sendMessage(msg, fromthreadID, (error, info) => {
                if (error) return api.sendMessage("Đã xảy ra lỗi khi gửi report của bạn.", threadID, messageID);
                api.sendMessage("Đã gửi report của bạn thành công.", threadID, messageID)
                multiple.handleMessageReply.push({
                    name: this.info.name,
                    messageID: info.messageID,
                    userID: senderID,
                    fromthreadID: threadID,
                    type: 'userReport'
                })
            })
            break;
        default:
            break;
    }
}
module.exports.run = async function({ api, event, args, multiple, Users, Threads, Cherry }) {
    var { threadID, senderID, messageID } = event;
    if (!args[0]) return api.sendMessage("Vui lòng nhập nội dung report", threadID, messageID);
    var { BotSystem, ADMIN } = Cherry.configs, sendTo = `${BotSystem ? BotSystem : ADMIN[0]}`;
    var userData = await Users.getData(senderID), threadData = await Threads.getData(threadID);
    var msg = "====📨️ Report 📨️====\n\n" +
    `Nội Dung: ${args.join(" ")}\n\n` +
    `Từ: ${userData.name}\nNhóm: ${threadData.name}\n\n______________________________\nReply Tin nhắn này kèm nội dung để phản hồi lại cho người dùng.`;
    return api.sendMessage(msg, sendTo, (error, info) => {
        if (error) return api.sendMessage("Đã xảy ra lỗi khi gửi report của bạn.", threadID, messageID);
        api.sendMessage("Đã gửi report của bạn thành công.", threadID, messageID);
        multiple.handleMessageReply.push({
            name: this.info.name,
            messageID: info.messageID,
            userID: senderID,
            fromthreadID: threadID,
            type: 'userReport'
        });
    })
}