module.exports.info = {
	name: "cherry",
	version: "1.0.0",
	permissions: 1,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Xem link repl, youtube của Cherry",
        short: "Xem link repl, youtube"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[Để trống/all/tag]',
	],
	countdown: 20
};
function send({ api, event, type }) {
  var { threadID, messageID, senderID } = event;
  switch (type) {
    case "1":
      return api.sendMessage(`https://www.youtube.com/c/HenryStudio`, threadID, messageID);
    case "2":
      return api.sendMessage(`https://replit.com/join/rbcrwinbou-hoahenry`, threadID, messageID);
    case "3":
      return api.sendMessage(`https://github.com/hoahenry/Cherry`, threadID, messageID);
    default:
      break;
  }
}
module.exports.handleMessageReply = async function({ api, event }) {
  var { body } = event;
  if (isNaN(body)) return api.sendMessage(`Chọn bằng số má.`, event.threadID)
  send({ api, event, type: body });
}

module.exports.run = async function({ api, event, multiple, args }) {
  var { threadID, messageID, senderID } = event;
  if (args[0]) return send({ api, event, type : args[0] });
  var msg = `1. link youtube (hướng dẫn cài Bot)\n2. link replit\n3. Link github của Cherry\n\nVui lòng reply tin nhắn theo số thứ tự bạn muốn lấy`;
  return api.sendMessage(msg, threadID, (error, info) => {
    multiple.handleMessageReply.push({
      name: this.info.name,
      messageID: info.messageID,
    })
  })
}