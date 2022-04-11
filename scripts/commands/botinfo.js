module.exports.info = {
	name: "botinfo",
	version: "1.0.1",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem tất cả các chi tiết mà Bot có. VD: sever, tất cả người dùng, nhóm...",
        short: "Xem chi tiết về Bot"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'',
	],
	countdown: 5,
	require: {
		"os": ""
	}
};

function handleByte(byte) {
	const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	let i = 0, usage = parseInt(byte, 10) || 0;

	while(usage >= 1024 && ++i){
		usage = usage/1024;
	}
  
	return(usage.toFixed(usage < 10 && i > 0 ? 1 : 0) + ' ' + units[i]);
}

function handleOS(ping) {
	var os = require("os");
	var cpus = os.cpus();
	var speed, chips;
	for (var i of cpus) chips = i.model, speed = i.speed;
	if (cpus == undefined) return;
	else return msg = `======= Thông Tin Máy Chủ =======\n\n` +
	`Tên Máy Chủ: ${os.hostname}.\nChip: ${chips}.\nTốc Độ Xử Lý: ${speed}MHz.\n\nTổng Bộ Nhớ: ${handleByte(os.totalmem())}.\nĐã Sử Dụng: ${handleByte(os.freemem())} (${(os.freemem() * 100 / os.totalmem()).toFixed()}%).\n\n` +
	`Ping: ${Date.now() - ping}ms.`;
}

module.exports.run = async function({ api, event, multiple, Cherry, Threads }) {
	var ping = Date.now();
	var threadInfo = await Threads.getData(event.threadID);
	var prefix = threadInfo.prefix ? threadInfo.prefix : Cherry.configs.prefix;
  const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");
    var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");
    var ngay = moment.tz("Asia/Ho_Chi_Minh").format("D");
    var thang = moment.tz("Asia/Ho_Chi_Minh").format("MM");    
    var nam = moment.tz("Asia/Ho_Chi_Minh").format("YYYY");
    var ngay = moment.tz("Asia/Ho_Chi_Minh").format("D");
    var thang = moment.tz("Asia/Ho_Chi_Minh").format("MM");
    var nam = moment.tz("Asia/Ho_Chi_Minh").format("YYYY");
    var d = new Date();
    var day = d.getDay()
if (day == 0) var day = "Chủ nhật"
else if (day == 1) var day = "Thứ hai"
else if (day == 2) var day = "Thứ ba"
else if (day == 3) var day = "Thứ tư"
else if (day == 4) var day = "Thứ năm"
else if (day == 5) var day = "Thứ sáu"
else if (day == 6) var day = "Thứ 7"
else if (day == 7) var day = "Chủ nhật"
    var { timeStart } = multiple;
    var time = process.uptime(),
        days = Math.floor(time / (60 * 60 * 60)),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);
	var severInfo = handleOS(ping);
	var msg = {
    body:`======= Cherry Infomations =======\nHôm nay là ${day} Ngày ${ngay} || ${thang} || ${nam}!\nBây giờ là: ${gio} : ${phut} : ${giay}\n\n\nBắt Đầu Hoạt Động: ${timeStart.fullTime}.\nĐã Hoạt Động:${hours < 10 ? (hours > 0 ? " 0" + hours + " giờ" : "") : (hours > 0 ? " " + hours + " giờ" : "")} ${minutes < 10 ? (minutes > 0 ? " 0" + minutes + " phút" : "") : (minutes > 0 ? " " + minutes + " phút" : "")}${seconds < 10 ? (seconds > 0 ? " 0" + seconds + " giây." : "") : (seconds > 0 ? " " + seconds + " giây." : "")}\n\n` +
	`Tổng Nhóm: ${multiple.allThreadsInfo.size} nhóm.\nTổng Người Dùng: ${multiple.allUsersInfo.size} người.\n` + 
	`Tổng Số Lệnh: ${multiple.commands.size - multiple.commandsHide.length}\n\n` + 
	`Prefix tổng: ${Cherry.configs.prefix}\nPrefix của Box: ${prefix}\n\n${severInfo ? severInfo : `Ping: ${Date.now() - ping}ms.`}`,attachment: (await require('axios')({
			url: (await require('axios')('https://apikanekiflop.tk/gaisexy')).data.data,
			method: "GET",
			responseType: "stream"
		})).data
  };
    return api.sendMessage(msg, event.threadID, (error, info) => { Cherry.autoUnsend(info.messageID, 1200000) },event.messageID);
}