module.exports.info = {
	name: "welcome",
    version: "1.0.2",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Đổi tin nhắn chào mừng khi có thành viên mới tham gia nhóm",
        short: "Tin nhắn chào mừng"
    },
	group: "Box Settings",
	guide: [
		'[gif/text] [Lời chào/link]',
	],
	countdown: 5
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = require("fs-extra");

    const path = `${process.cwd()}/scripts/events/cache/`;
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

module.exports.run = async function ({ args, event, api, Threads, Cherry, multiple }) {
    const { existsSync, createReadStream } = require("fs-extra");
    const { threadID, messageID } = event;
    const msg = args.slice(1, args.length).join(" ");

    switch (args[0]) {
        case "text":
            multiple.allThreadsInfo.get(threadID).msgWelcome = msg;
            await Threads.setData(threadID, { msgWelcome: msg });
            return api.sendMessage("Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:", threadID, function () {
                msg = msg
                .replace(/\{name}/g, "[Tên thành viên]")
                .replace(/\{type}/g, "[Bạn/các bạn]")
                .replace(/\{soThanhVien}/g, "[Số thành viên]")
                .replace(/\{threadName}/g, "[Tên nhóm]")
                .replace(/\{prefix}/g, "[prefix]")
                .replace(/\{time}/g, "[Thời gian]");
                return api.sendMessage(msg, threadID);
            });
        case "gif":
            const path = `${process.cwd()}/scripts/events/cache/${threadID}.gif`;
            if (msg == "remove") {
                if (!existsSync(path)) return api.sendMessage("Nhóm của bạn chưa có gif welcome", threadID, messageID);
                unlinkSync(path);
                return api.sendMessage("Đã gỡ bỏ thành công file gif của nhóm bạn!", threadID, messageID);
            } else {
                if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) return api.sendMessage("Url bạn nhập không phù hợp!", threadID, messageID);
                try {
                    await Cherry.downloadFile(msg, path);
                } catch (e) {
                    return api.sendMessage("Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!", threadID, messageID);
                }
                return api.sendMessage({ body: "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:", attachment: createReadStream(path) }, threadID, messageID);
            }
        case "view":
            var welcome = multiple.allThreadsInfo.get(threadID).msgWelcome;
            return api.sendMessage(`${welcome ? 'Dưới đây là phần tin nhắn chào mừng của nhóm này:\n\n' + welcome : 'Nhóm này chưa được đặt tin nhắn chào mừng'}`, threadID)
        default: 
            return Cherry.commandError(this.info.name, threadID, messageID);
    }
}