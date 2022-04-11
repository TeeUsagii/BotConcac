module.exports.info = {
  name: "girlchina",
  version: "1.0.0",
  permissions: 1,
  author: {
    name: "Nguyễn Đức Kiên (DeathOver)",
    facebook: "https://facebook.com/DeathOver.S2T"
  },
  description: {
    long: "Girl China",
    short: "Ảnh Gái Trung Quốc"
  },
  group: "Tools",
  guide: [
		'[Girl China]',
	],
  countdown: 3,
  require: {
    "axios": "",
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args, multiple })  {
	var axios = require("axios");
	var request = require("request");
	var fs = require("fs-extra");
		axios.get('https://api-jrt.j-jrt-official.repl.co/china.php').then(res => {
		let callback = function () {
					api.sendMessage({
						body : ``,
						attachment: fs.createReadStream(__dirname + '/cache/china1.jpg')
					}, event.threadID, () => fs.unlinkSync(__dirname + '/cache/china1.jpg'), event.messageID);
				};
				request(res.data.data).pipe(fs.createWriteStream(__dirname + '/cache/china1.jpg')).on("close", callback);
			})
}
