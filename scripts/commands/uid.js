module.exports.info = {
	name: "uid",
	version: "1.0.1",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "lấy id facebook của bạn hoặc người muốn lấy id",
        short: "lấy id facebook"
    },
	group: "Tools",
	guide: [
		'[tag ai đó hoặc để trống]',
	],
	countdown: 5,
};

module.exports.run = function({ api, event }) {
	if (Object.keys(event.mentions) == 0) return api.sendMessage(`Của bạn đây: ${event.senderID}`, event.threadID, event.messageID);
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
		return;
	}
}