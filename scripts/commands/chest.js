module.exports.info = {
	name: "chest",
	version: "1.0.0",
	permissions: 1,
	author: {
		name: "Henry - Nguyễn Đức Kiên",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Mua, xem, mở những chiếc rương báu xem có gì bên trong nào?",
        short: "Minigame mở rương"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[]',
	],
	countdown: 20
};

// module.exports.onLoad = async function() {
//     var axios = require('axios');
//     var { writeFileSync, mkdirSync, existsSync } = require('fs-extra');
//     var { data } = await axios.post('https://cherry-sever.glitch.me/chest', { type: 'get' });
//     var path = __dirname + '/cache/';
//     if (!existsSync(path)) mkdirSync(path, { recursive: true });
//     writeFileSync(path + '/chest.json', JSON.stringify(data, null, 4));
// }

class playerMine {
  constructor(ID, name, xeng) {
    this.mine = [{ ID: ID, name: name, xeng: xeng }];
  }
  get() {
    
  }
  mine(ID) {
    var i = this.mine.find(item => item.ID == ID);
    if (!i) return false;
    else {
      setInterval(() => {
        
      })
    }
  }//Nghỉ ông ơi, mai tiếp :v
}

module.exports.handleMessageReply = async function({ api, event, Reply, multiple }) {
    var { threadID, messageID, senderID, body } = event;
    var { type } = Reply;
    switch (type) {
        case "changestore":
            var { store } = Reply;
            if (parseInt(body) > Object.keys(store).length) return api.sendMessage(`Lựa chọn của bạn không nằm trong danh sách`);
            var index = Object.keys(store)[body - 1], msg = `Đây là những item trong danh mục ${index} mà bạn có thể mua:\n\n`, number = 1;
            var item = store[index];
            for (var [key, value] of Object.entries(item)) {
                msg += `${number++}. ${index} ${key}: ${value.price} coins.\n`
            }
            msg += `\nReply tin nhắn này kèm số tương ứng với vật phẩm bạn muốn mua.`;
            return api.sendMessage(msg, threadID, (error, info) => {
                multiple.handleMessageReply.push({
                    name: this.info.name,
                    messageID: info.messageID,
                    type: 'buy',
                    userID: senderID,
                    item: item
                });
            });
        case "buy":
            var { item } = Reply;
            if (parseInt(body) > Object.keys(item).length) return api.sendMessage(`Lựa chọn của bạn không nằm trong danh sách`);
            var index = Object.keys(item)[body - 1], msg = '', number = 1;
            var buy = item[index];
            var userInfo = await Others.getData(senderID);
            if (userInfo.coin < buy.price) return api.sendMessage(`Bạn không đủ tiền để mua ${index}.`, threadID, messageID);
            var { chest } = userInfo;
            var itemName = chest.item.find(i => i.name == index);
            if (!itemName) {
              
            }
    }
}

module.exports.run = async function({ api, args, event, Users, Others, multiple }) {
    var { threadID, senderID, messageID } = event;
    var { readFileSync } = require('fs-extra');
    var data = JSON.parse(readFileSync(__dirname + '/cache/chest.json', 'utf8'));
    switch (args[0]) {
        case 'buy':
        case 'mua':
            var { store } = data, msg = 'Cửa hàng hiện tại phục vụ những mục sau:\n\n', number = 1;
            for (var [key, values] of Object.entries(store)) {
                msg += `${number++}. ${key}\n`
            }
            msg += `\nVui lòng reply tin nhắn này kèm số tương ứng với danh mục bạn muốn xem.`;
            return api.sendMessage(msg, threadID, (error, info) => {
                multiple.handleMessageReply.push({
                  name: this.info.name,
                  messageID: info.messageID,
                  type: 'changestore',//Thêm rồi. Nó đay 
                  userID: senderID,
                  store: store
                });
            }, messageID);
        case "open":
        case "-o":
            var { chest } = await Others.getData(senderID), msg = `Bạn đang có tổng cộng ${chest.allChest.length} rương, bao gồm:\n\n`, number = 1, sortChest = [];
            for (var i of chest) {
                if (!sortChest.includes(i)) {
                    sortChest.push({ item: i, amount: 1 })
                } else {
                    sortChest.forEach(e => {
                        if (e.item == i) e.amount++;
                    })
                }
            }
            for (var i of sortChest) {
                msg += `${number++}. ${i.item}: ${i.amount} cái\n`
            }
            msg += `\nVui lòng reply tin nhắn này kèm số tương ứng để mở toàn bộ rương trong mục mà bạn chọn.`;
            return api.sendMessage(msg, threadID, (error, info) => {
                multiple.handleMessageReply.push({
                  name: this.info.name,
                  messageID: info.messageID,
                  type: 'open',
                  userID: senderID,
                  chest: chest
                });
            }, messageID);
        case "use":
        case "dùng":
            var { chest } = await Others.getData(senderID), msg = `Bạn đang có các item hỗ trợ sau:\n\n`, number = 1;
            for (var [keys, value] of Object.entries(chest.item)) {
              msg += `${number++}. ${keys}: `
            }
        case "đào":
        case "-d":
            //Dùng để đào rương
        default:
            Cherry.commandError(this.info.name, threadID, messageID);
    }
}