module.exports.info = {
	name: "sinhnhat",
	version: "1.0.2",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem hôm nay là sinh nhật của ai trong box?",
        short: "Hôm nay sinh nhật ai?"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'',
	],
	countdown: 5
};

module.exports.handleEvents = async function({ event, api, Users, multiple }) {
    var { threadID, senderID } = event;
    var userInfo = multiple.allUsersInfo.get(senderID);
    if (userInfo && userInfo.isBirthday == true && !userInfo.happyBirthday) {
        var msg = `🎂🎉🎊Chúc mừng sinh nhật ${userInfo.name} 🎊🎉🎂\n\nChúc em hạnh phúc đậm đà tình yêu 💏\nChúc em sức khỏe thật nhiều 💪\nChúc em may mắn vạn điều bình an 🍀\n\n`;
        userInfo.gioitinh == "Nam" ? msg += `Chúc em ngày một giàu sang\nTrăm ngàn hạnh phúc, kho tàng tình yêu\nCuối thơ chúc nốt một điều\nChúc em may mắn, sớm chiều thành công🥰` : msg += `Chúc em ngày một giàu sang\nNiềm vui hạnh phúc càng ngày càng xinh\nChúc em êm ấm gia đình\nNăm nay kiếm được phúc tinh cuộc đời 😘`;
        msg += `\nMọi người nhanh nhanh đến chúc mừng sinh nhật cho bạn ấy đi nào ^^`;
        await Users.setData(senderID, {
            happyBirthday: {
                status: true,
                timestamp: Date.now()
            }
        })
        var tag = {
            tag: userInfo.name,
            id: userInfo.ID
        }
        return api.sendMessage({ body: msg, mentions: tag }, threadID);
    }
}

module.exports.run = async function({ api, event, Threads, multiple }) {
    var { threadID } = event;
    var threadData = await Threads.getData(threadID) || "", tag = [], msg = "Hôm nay là ngày sinh nhật của:\n\n", birthday = "", num = 0;
    if (!threadData) return api.sendMessage("Thiếu dữ kiện để thực thi lệnh này.", threadID);
    var members = threadData.members;
    for (var i of Object.keys(members)) {
        var userInfo = multiple.allUsersInfo.get(i);
        if (!userInfo || userInfo.isBirthday == false) continue;
        if (userInfo.isBirthday == true) {
            num++;
            birthday += `${num}. ${userInfo.name}\n`
            tag.push({
                tag: userInfo.name,
                id: i
            });
        }
    }
    birthday ? msg += `${birthday}\nMọi người tới chúc mừng sinh nhật cho ${tag.length < 2 ? "bạn ấy" : "các bạn ấy"} nào.` : msg = "Hôm nay không là ngày sinh nhật của thành viên nào cả."
    return tag.length > 0 ? api.sendMessage({ body: msg, mentions: tag }, threadID) : api.sendMessage(msg, threadID);
}
