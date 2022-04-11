module.exports.info = {
	name: "lyrics",
	version: "1.0.1",
	permissions: 1,
	author: {
		name: "Nguyễn Đức Kiên (DeathOver)",
		facebook: "https://facebook.com/DeathOver.S2T"
	},
	description: {
        long: "Lyrics",
        short: "Lời bài hát"
    },
	group: "Tools",
	guide: [
		'[Tìm Lyrics Nhạc]',
	],
	countdown: 5,
	require: {
	  "axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, args })  {
    var { threadID, messageID } = event;
    var axios = require("axios");
    const { data } = await axios.get(`https://jrt-api.j-jrt-official.repl.co/lyrics?q=${encodeURIComponent(args.join(' '))}`);
    var { error, name, singer, lyrics } = data;
    if (error) return api.sendMessage("Lỗi khi lấy bài hát", threadID, messageID);
    return api.sendMessage(`[•] Tên bài hát: ${name}\n[•] Tên ca sĩ: ${singer}\n≻───── •Cherry• ─────≺\n[•] Lời bài hát:\n${lyrics} `, threadID, messageID);
}
//copy hết luôn à:v

//tưởng vậy :v chứ nàm thao :v