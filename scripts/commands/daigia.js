module.exports.info = {
	name: "daigia",
	version: "1.0.2",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem số tiền của bản thân, người được tag hoặc tất cả (Miễn là họ có ID trong Data)",
        short: "Xem ai giàu nhất nào?"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[Để trống/all/tag]',
	],
	countdown: 20
};

module.exports.run = async function ({ args, api, event, Others, Users, Cherry, Threads }) {
    var { threadID, senderID, messageID, mentions } = event;
    var { members } = await Threads.getData(threadID);
    var msg = "", number = 0, allDaiGia = [];
	if (args[0] == "all") {
		for (var i of Object.keys(members)) {
            var { coin } = await Others.getData(i);
            var { name } = await Users.getData(i);
            allDaiGia.push({"ID": i, "coin": coin, "name": name})
        }
        allDaiGia.sort((a, b) => b.coin - a.coin);
        for (const lastData of allDaiGia) {
            number++;
            msg += `Hạng ${number}. ${lastData.name} với ${lastData.coin} coin.\n`;
        }
        return api.sendMessage(msg, threadID, (error, info) => { Cherry.autoUnsend(info.messageID, 120000) }, messageID);
	} else if (Object.keys(mentions).length > 0) {
		for (var i of Object.keys(members)) {
            var { coin } = await Others.getData(i);
            var { name } = await Users.getData(i);
            allDaiGia.push({"ID": i, "coin": coin, "name": name})
        }
        allDaiGia.sort((a, b) => b.coin - a.coin);
        mentions = Object.keys(mentions);
        console.log(mentions)
        for (const lastData of allDaiGia) {
            number++;
            if (mentions.includes(lastData.ID)) msg += `- ${lastData.name} đứng hạng ${number} với ${lastData.coin} coin.\n`;
            else continue;
		}
        console.log(msg)
        return api.sendMessage(msg, threadID, messageID);
    } else {
        for (var i of Object.keys(members)) {
            var { coin } = await Others.getData(i);
            allDaiGia.push({"ID": i, "coin": coin});
        }
        allDaiGia.sort((a, b) => b.coin - a.coin);
        for (const lastData of allDaiGia) {
            number++;
            if (lastData.ID == senderID) return api.sendMessage(`Bạn đứng hạng ${number} với ${lastData.coin} coin.`, threadID, messageID);
        }
	}
    Cherry.commandError(this.info.name, threadID, messageID);
}
