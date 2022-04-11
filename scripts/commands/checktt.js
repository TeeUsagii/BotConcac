module.exports.info = {
	name: "checktt",
	version: "1.0.2",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem số tin nhắn đã gửi của bản thân, người được tag hoặc tất cả mọi người (Miễn là họ có ID trong Data)",
        short: "Xem số tin nhắn đã gửi"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[Để trống/all/tag]',
	],
	countdown: 20
};

module.exports.run = async function ({ args, api, event, Threads, Users, Cherry, multiple }) {
	var { threadID, messageID, senderID } = event;
	var mention = Object.keys(event.mentions);
	var members = await Threads.getAllUsers(threadID, ['totalMsg']);
    var number = 0, msg = "";
	if (args[0] == "all") {
        members.sort((a, b) => b.totalMsg - a.totalMsg);
        for (const lastData of members) {
            var name = multiple.allUsersInfo.get(lastData.ID).name;
            number++;
            msg += `${number}. ${name} với ${lastData.totalMsg} tin nhắn \n`;
        }	
		return api.sendMessage(msg, threadID, (error, info) => { Cherry.autoUnsend(info.messageID, 120000) }, messageID);
	} else if (mention[0]) {
		members.sort((a, b) => b.totalMsg - a.totalMsg);
		for (const lastData of members) {
            var name = multiple.allUsersInfo.get(lastData.ID).name;
            number++;
			for (var i of mention) {
				if (lastData.ID == i) {
					msg += `${name} đứng hạng ${number} với ${lastData.totalMsg} tin nhắn \n`;
				}
			}
        }
		return api.sendMessage(msg, threadID, messageID);
	} else {
		members.sort((a, b) => b.totalMsg - a.totalMsg);
        for (const lastData of members) {
            number++;
			if (lastData.ID == senderID) {
				return api.sendMessage(`Bạn đứng hạng ${number} với ${lastData.totalMsg} tin nhắn`, threadID, messageID);
			}
        }
	}
    Cherry.commandError(this.info.name, threadID, messageID);
}