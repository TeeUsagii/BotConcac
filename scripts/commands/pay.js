module.exports.info = {
	name: "pay",
    version: "1.1.0",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Chuyển tiền cho người được tag",
        short: "Chuyển tiền"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[tag]',
	],
	countdown: 5
};

module.exports.run = async({ event, api, args, Others }) => {
    var { senderID, threadID, messageID, mentions } = event;
    var { coin: senderMoney } = await Others.getData(senderID);
    var data = [], msg = '';
    if (Object.keys(mentions).length == 0) return api.sendMessage('Bạn cần tag người nhận tiền.', threadID, messageID);
    for (var [id, name] of Object.entries(mentions)) {
        var { coin: mentionMoney } = await Others.getData(id);
        data.push({ ID: id, name: name.replace("@", ""), coin: mentionMoney });
        args = args.filter(item => item != name);
    }
    var moneyPay = parseInt(args[0]), pay = moneyPay;
    if (isNaN(moneyPay) || moneyPay < 0 || !moneyPay) return api.sendMessage("Số tiền được chuyển phải là số và là số nguyên dương.", threadID, messageID);
    if (senderMoney < moneyPay || Object.keys(mentions).length * moneyPay > senderMoney) return api.sendMessage('Số tiền bạn chuyển cho người khác phải nhỏ hơn hoặc bằng số dư của bạn.', threadID, messageID);
    for (var i of data) {
        await Others.setData(i.ID, { coin: i.coin + pay });
        await Others.setData(senderID, { coin: senderMoney - pay });
        msg += `- Bạn đã chuyển cho ${i.name} ${moneyPay} coin.\n`
    }
    return api.sendMessage(msg, threadID, messageID);
}