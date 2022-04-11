module.exports.info = {
	name: "leave",
    version: "1.0.1",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Đổi thông báo, thay/xóa gif khi thành viên rời nhóm.",
        short: "Thông báo thành viên rời"
    },
	group: "Box Settings",
	guide: [
		'[gif/text] [Lời chào/link]',
	],
	countdown: 5
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = require('fs-extra');

    const path = process.cwd() + '/scripts/events/cache/';
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

module.exports.run = async function ({ args, event, api, Threads, multiple }) {
    const { existsSync, createReadStream } = require("fs-extra");
    const { threadID, messageID } = event;
    const msg = args.slice(1, args.length).join(" ");

    switch (args[0]) {
        case "text":
            multiple.allThreadsInfo.get(threadID).msgLeave = msg;
            await Threads.setData(threadID, { msgLeave: msg });
            return api.sendMessage("Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:", threadID, function () {
                msg = msg
                .replace(/\{name}/g, "[Tên thành viên]")
                .replace(/\{type}/g, "[Tự rời/Bị quản trị viên]");
                return api.sendMessage(body, threadID);
            });
        case "gif":
            const path = `${process.cwd()}/scripts/events/cache/${threadID}.gif`;
            if (msg == "remove") {
                if (!existsSync(path)) return api.sendMessage("Nhóm của bạn chưa từng cài đặt gif leave", threadID, messageID);
                unlinkSync(path);
                return api.sendMessage("Đã gỡ bỏ thành công file gif của nhóm bạn!", threadID, messageID);
            }
            else {
                if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) return api.sendMessage("Url bạn nhập không phù hợp!", threadID, messageID);
                try {
                    await Cherry.downloadFile(msg, path);
                } catch (e) {
                    return api.sendMessage("Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!", threadID, messageID);
                }
                return api.sendMessage({ body: "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:", attachment: createReadStream(path) }, threadID, messageID);
            }
        default:
            return Cherry.commandError(this.info.name, threadID, messageID);
    }
}