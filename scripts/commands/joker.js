module.exports.info = {
  name: "joker",
  version: "1.0.0",
  permissions: 1,
  author: {
    name: "Nguyễn Đức Kiên (DeathOver)",
    facebook: "https://facebook.com/DeathOver.S2T"
  },
  description: {
    long: "Tên Hề Điên Loạn",
    short: "Những Câu Nói Bất Hủ Của Joker"
  },
  group: "Tools",
  guide: [
		'[Câu Nói Của Joker]',
	],
  countdown: 5,
  require: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  var { threadID, messageID } = event;
  var axios = require("axios");
  const rep = await axios.get(`https://jrt-api.j-jrt-official.repl.co/joker`);
  var joker = rep.data.data;
  return api.sendMessage(`≻───── •Joker• ─────≺\n - Joker said that:\n\n${joker} `, threadID, messageID);
}
