module.exports.info = {
	name: "buy",
	version: "1.0.0",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem các lệnh được bán",
        short: "Xem lệnh được bán"
    },
	group: "System",
	guide: [
		'',
	],
	countdown: 20
};

module.exports.run = function({ api, event, multiple }) {
    var { threadID, messageID } = event;
    var { sellList } = multiple, number = 0, msg = "";
    for (var [key, value] of sellList) {
        number++
        msg += `${number}. Lệnh ${key}: ${value}\n`;
    }
    msg += `\nNếu bạn muốn mua lệnh, vui lòng liên hệ Email: hotro.cherry@gmail.com.`;
    return api.sendMessage(msg, threadID)
}