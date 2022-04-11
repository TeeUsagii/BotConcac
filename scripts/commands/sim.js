module.exports.info = {
	name: "sim",
	version: "1.0.2",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Chat với cđ bot mất dạy nhất hệ mặt trời",
        short: "Reaction with Bot"
    },
	group: "Reaction with Bot",
	guide: [
		'[on/off]',
	],
	countdown: 5,
    require: {
        axios: ''
    }
};

async function Sim(content) {
    var axios = require("axios");
    try {
        var { data } = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(content)}&lc=vn`);
        return { error: false, data: data }
    } catch (error) {
        return { error: true, data: {} }
    }
}

module.exports.onLoad = function({ Cherry }) {
    if (!Cherry.sim) Cherry.sim = new Map();
}

module.exports.handleEvents = async function({ api, event, Cherry }) {
    var { threadID, senderID, body, messageID } = event;
    if (Cherry.sim.has(threadID)) {
        if (senderID == api.getCurrentUserID()) return;
        var { data, error } = await Sim(body);
        if (error) return api.sendMessage(`Đã có lỗi xảy ra khi lấy câu trả lời của Sim lời thoại này`, threadID, messageID);
        return api.sendMessage(data.success, threadID, messageID);
    }
}

module.exports.run = async function({ api, event, args, Cherry }) {
    var { threadID, messageID } = event;
    if (args.length == 0) return api.sendMessage(`Bạn cần nhập On hoặc Off để bật/tắt Sim.`, threadID, messageID);
    switch (args[0]) {
        case "On":
        case "on":
        case "ON":
            if (Cherry.sim.has(threadID)) return api.sendMessage(`Simsimi vẫn đang được bật.`, threadID, messageID);
            return api.sendMessage(`Đã bật Simsimi`, threadID, () => Cherry.sim.set(threadID));
        case "Off":
        case "off":
        case "OFF":
            if (!Cherry.sim.has(threadID)) return api.sendMessage(`Simsimi chưa được bật nha`, threadID, messageID);
            Cherry.sim.delete(threadID);
            return api.sendMessage("Đã tắt Simsimi", threadID, messageID);
        default:
            return Cherry.commandError(this.info.name, threadID, messageID);
    }
}