module.exports.info = {
  name: "appstate",
  version: "1.0.0",
  permissions: 1,
  author: {
    name: "Nguyễn Đức Kiên (DeathOver)",//source by JRT
    facebook: "https://facebook.com/DeathOver.S2T"
  },
  description: {
    long: "Làm Mới Appstate",
    short: "Tự Động Thay Appstate"
  },
  group: "Admin",
  guide: [
		'getAppState',
	],
  countdown: 5,
  require: {
    "axios": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  var fs = require("fs-extra");
  var permission = ("100041764608130");
	if (!permission.includes(event.senderID)) return api.sendMessage("Không cần làm mới appstate hộ admin đâu", event.threadID, event.messageID);
  let appstate = api.getAppState();
  // convert JSON object to a string
  const data = JSON.stringify(appstate);
  // write file to disk
  fs.writeFile(`${__dirname}/../../appstate.json`, data, 'utf8', (err) => {
    if (err) {
      return api.sendMessage(`Error writing file: ${err}`, event.threadID);
    } else {
      return api.sendMessage(`Đã làm mới appstate thành công`, event.threadID);
    }
  });
}
