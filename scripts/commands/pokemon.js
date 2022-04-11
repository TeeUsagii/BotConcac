module.exports.info = {
  name: "pokemon",
  version: "1.0.1",
  permissions: 1,
  author: {
    name: "Nguyễn Đức Kiên", //source: D-Jukie
    facebook: "https://facebook.com/s2.henry"
  },
  description: {
    long: "Thông Tin Pokemon",
    short: "Xem Thông Tin Về Pokemon"
  },
  group: "Minigame",
  guide: [
		'[]',
	],
  countdown: 5,
  require: {
    "axios": "",
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, args, event, Users, Others, Cherry }) {
  var axios = require("axios");
  var request = require("request");
  var whothatpokemon = args.join(" ");
  if (!whothatpokemon) return api.sendMessage(`Chưa Nhập Tên Pokemon mà-.-`, event.threadID, event.messageID)
  try {
    const res = await axios.get(`https://some-random-api.ml/pokedex?pokemon=${whothatpokemon}`);
    const data = res.data;
    const stt = data.stats
    return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${data.description}`), (err, response, body) => {
      if (err) return api.sendMessage(`Đã có lỗi xảy ra!`, event.threadID, event.messageID);
      var retrieve = JSON.parse(body);
      var text = '';
      retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
      var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
      return api.sendMessage(`
» Pokemon: ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}
» Generation: ${data.type}
» Tier: ${data.generation}
» Type: ${data.species.join(", ")}
» Egg group: ${data.egg_groups.join(', ')}
» Ability: ${data.abilities.join(", ")}
» Height: ${data.height}
» Weight: ${data.weight}
» Status:\n »HP: ${stt.hp} | ATK: ${stt.attack} | DEF: ${stt.defense} | Speed: ${stt.speed}
» Evolution: ${data.family.evolutionLine.join(" => ")}
» Description: ${text}`, event.threadID, event.messageID)
    })
  } catch {
    return api.sendMessage(`Không tìm thấy tên pokemon!!!`, event.threadID, event.messageID);
  }
}
//đang cập nhật
