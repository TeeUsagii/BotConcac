module.exports.info = {
	name: "testmode",
	version: "1.0.0",
	permissions: 3,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Chế độ chỉ người quản lí Bot mới có thể sử dụng Bot",
        short: "Bật/tắt testMode"
    },
	group: "system",
	guide: [
		'',
	],
	countdown: 5
};

module.exports.run = function({ api, event, Cherry }) {
    var { threadID, messageID } = event;
    var { testMode } = Cherry.configs;
    if (testMode == false) {
        Cherry.configs.testMode = true;
        return api.sendMessage(`Đã bật chế độ testMode, chỉ người quản lí Bot mới có thể sử dụng Bot.`, threadID, messageID);
    } else {
        Cherry.configs.testMode = false;
        return api.sendMessage(`Đã tắt chế độ testMode`, threadID, messageID);
    }
}