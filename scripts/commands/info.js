module.exports.info = {
	name: "info",
    version: "1.0.1",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Xem thông tin của những người dùng được tag",
        short: "Xem thông tin người dùng"
    },
	group: "Tools",
	guide: [
		'[users/threads] [all/tag]',
	],
	countdown: 5
};

module.exports.run = async function({ api, args, event, Users, Threads }) {
    var { threadID, senderID, messageID, mentions } = event;
    var msg = '';
    switch (args[0]) {
        case 'users':
        case '-u':
            var { members } = await Threads.getData(threadID);
            if (Object.keys(mentions).length == 0) {
                var info = await Users.getData(senderID);
                msg += `<3 ${info.name} <3\n\n` +
                `Tên: ${info.name}\n` +
                `Biệt Danh: ${members[senderID].bietdanh ? members[senderID].bietdanh : "Không có"}\n` +
                `Tin Nhắn Đã Gửi: ${members[senderID].totalMsg}\n` +
                `Giới Tính: ${info.gioitinh}\n` +
                `Mối Quan Hệ: ${info.hasOwnProperty('dating') ? "Đang Hẹn Hò" : "Độc Thân"}\n` +
                `Profile: https://www.facebook.com/${encodeURIComponent(info.facebookID)}`
                return api.sendMessage(msg, threadID, messageID)
            }
            for (var i of Object.keys(mentions)) {
                var info = await Users.getData(i);
                msg += `\n<3 ${info.name} <3\n` +
                `Biệt Danh: ${members[i].bietdanh ? members[i].bietdanh : "Không có"}\n` +
                `Tin Nhắn Đã Gửi: ${members[i].totalMsg}\n` +
                `Giới Tính: ${info.gioitinh}\n` + 
                `Mối Quan Hệ: ${info.hasOwnProperty('dating') ? "Đang Hẹn Hò" : "Độc Thân"}\n` +
                `Profile: https://www.facebook.com/${encodeURIComponent(info.facebookID)}\n`
            }
            return api.sendMessage(msg, threadID);
        case "threads":
            if (args[1] == 'all') {
                var allThreads = await Threads.getAll();
                for (var i of allThreads) {
                    msg += `\n<3 ${i.name} <3\n` +
                    `Tên Nhóm: ${i.name}\n` +
                    `Emoji: ${i.emoji ? i.emoji : 'Không Sử Dụng'}\n` +
                    `Thành Viên: ${Object.keys(i.members).length} thành viên\n` +
                    `Mã Giao Diện: ${i.color}\n` +
                    `Tổng Số Tin Nhắn: ${i.totalMsg}\n` +
                    `Admin: ${i.adminIDs.length} người\n` +
                    `Ngày Tạo Dữ Liệu: ${i.createTime.fullTime}\n`
                }
                return api.sendMessage(msg, threadID);
            } else {
                var info = await Threads.getData(threadID);
                msg += `\n<3 ${info.name} <3\n\n` +
                `Tên Nhóm: ${info.name}\n` +
                `Emoji: ${info.emoji ? info.emoji : 'Không Sử Dụng'}\n` +
                `Thành Viên: ${Object.keys(info.members).length} thành viên\n` +
                `Mã Giao Diện: ${info.color}\n` +
                `Tổng Số Tin Nhắn: ${info.totalMsg}\n` +
                `Admin: ${info.adminIDs.length} người\n` +
                `Ngày Tạo Dữ Liệu: ${info.createTime.fullTime}\n`
                return api.sendMessage(msg, threadID);
            }
    }
    
}