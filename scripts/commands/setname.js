module.exports.info = {
	name: "setname",
    version: "1.0.2",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Đổi biệt danh của bản thân hoặc người được tag",
        short: "Đổi biệt danh"
    },
	group: "Tools",
	guide: [
		'[tag/tên]',
	],
	countdown: 5
};

module.exports.run = async function({ api, event, args }) {
	const { threadID, senderID, mentions } = event, ID = [];
	if (Object.keys(mentions).length == 0) {
        var name = args.join(" ")
        return api.changeNickname(name, threadID, senderID);
    }
    var nickname = args.join(" ");
    for (var [id, name] of Object.entries(mentions)) {
        ID.push(id)
        nickname = nickname.replace(name, "");
    }
    for (var i of ID) {
        api.changeNickname(nickname, threadID, i)
    }
}
