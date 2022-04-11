module.exports.info = {
	name: "say",
    version: "1.0.1",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Chuyển văn bản thành giọng nói của Google",
        short: "Text to speech"
    },
	group: "Tools",
	guide: [
		'[Để trống = vi/ru/en/ko/ja] [Văn bản]',
	],
	countdown: 5,
    require: {
        "fs-extra": "",
        "path": "",
    }
};

module.exports.run = async function({ api, event, args, Cherry }) {
	try {
		const { createReadStream, unlinkSync } = require("fs-extra");
		const { resolve } = require("path");
        var { threadID, senderID, messageReply } = event;
        var content = messageReply ? messageReply.body : args.join(" ");
        var language = (["ru", "en", "ko", "ja", "cn", "la", "cu", "co"]).some(i => content.indexOf(i) == 0) ? content.slice(0, content.indexOf(" ")) : "vi";
		var msg = language != "vi" ? content.slice(3, content.length) : content;
		const path = resolve(__dirname, 'cache', `${threadID}_${senderID}.mp3`);
		await Cherry.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${language}&client=tw-ob`, path);
		return api.sendMessage({ attachment: createReadStream(path)}, threadID, () => unlinkSync(path));
	} catch (e) { return console.log(e) };
}