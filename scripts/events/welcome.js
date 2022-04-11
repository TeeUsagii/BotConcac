module.exports.info = {
	name: "welcome",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	author: {
		name: "Henry",
		facebook: ""
	},
	description: "Thông báo bot hoặc người vào nhóm",
	require: {
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, Threads, Cherry, multiple }) {
	const { threadID, logMessageData } = event;
	var { prefix } = await Threads.getData(threadID);
	if (logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`${Cherry.configs.BOTNAME ? Cherry.configs.BOTNAME : "Cherry Bot - Create By Henry (Ry #2052)"}`, threadID, api.getCurrentUserID());
		return api.sendMessage(`Xin chào, mình là Cherry 😁\nRất vui khi được gặp mọi người 🥰`, threadID, () => {
			api.sendMessage(`Hiện tại mọi người có thể sử dụng ${multiple.commands.size} lệnh\nPrefix khả dụng là: ${prefix ? prefix : Cherry.configs.prefix}\nGửi ${prefix ? prefix : Cherry.configs.prefix}help để xem hướng dẫn sử dụng.`, threadID);
		});
	}
	var { createReadStream, existsSync } = require("fs-extra");
	var session = Cherry.session();
	var { threadName, participantIDs } = await api.getThreadInfo(threadID);
	var data = await Threads.getData(threadID);
	var gif = __dirname + `/cache/${threadID}.gif`;
	var mentions = [], name = [], totalMembers = participantIDs.length, addLength = 0;
	for (var i of logMessageData.addedParticipants) {
		name.push(i.fullName);
		mentions.push({ id: i.userFbId, tag: i.fullName });
		totalMembers++;
		addLength++;
	}
	var body = data.msgWelcome ? data.msgWelcome : 'Chào mừng {name} đã đến với {threadName} 🥰\n{type} là thành viên thứ {totalMember} của nhóm 🥳\nChúc {type} có một {time} vui vẻ\n\nNote: Sử dụng {prefix}help để xem hướng dẫn sử dụng Bot.';
	body = body
	.replace(/\{name}/g, name.join(', '))
	.replace(/\{type}/g, (addLength > 1) ?  'các bạn' : 'bạn')
	.replace(/\{soThanhVien}/g, totalMembers)
	.replace(/\{threadName}/g, threadName)
	.replace(/\{time}/g, session)
	.replace(/\{prefix}/g, prefix ? prefix : Cherry.configs.prefix);
	if (!existsSync(gif)) var msg = { body: body, mentions: mentions };
	else var msg = { body: body, mentions: mentions, attachment: createReadStream(gif) };
	return api.sendMessage(msg, threadID);
}