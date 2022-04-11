module.exports.info = {
  name: "gaisexy",
  version: "1.0.0",
  permissions: 1,
  author: {
    name: "Nguyễn Đức Kiên (DeathOver)",
    facebook: "https://facebook.com/DeathOver.S2T"
  },
  description: {
    long: "Girl",
    short: "Ảnh Gái"
  },
  group: "Tools",
  guide: [
		'[Girl]',
	],
  countdown: 3,
  require: {
    "axios": "",
    "request": "",
    "fs-extra": ""
  }
};
module.exports.run = async function ({ api, event}) {
  const {threadID,messageID} = event
var msg = {
		body: `Ảnh gái sếch si đây`,
		attachment: (await require('axios')({
			url: (await require('axios')('https://apikanekiflop.tk/gaisexy')).data.data,
			method: "GET",
			responseType: "stream"
		})).data
	}
  return api.sendMessage(msg, threadID, messageID)
}