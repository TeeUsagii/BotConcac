module.exports.info = {
	name: "hoingu",
    version: "1.0.0-beta",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Nhận câu hỏi từ một người đã gửi lên sever va trả lời câu hỏi đó. Bạn cũng có thể gửi lên câu hỏi của mình",
        short: "Nhận câu hỏi và trả lời"
    },
	group: "Tools",
	guide: [
		'[để trống/send/info]'
	],
	countdown: 5,
    require: {
        "axios": ""
    }
};

module.exports.handleMessageReply = async function({ api, event, Users, Reply, multiple }) {
    var { threadID, messageID, senderID, body } = event;
    const axios = require('axios');
    var { author, type } = Reply;
    if (senderID != author) return;
    switch (type) {
        case "answer":
            var { data, timeOut } = Reply;
            var { name } = await Users.getData(senderID);
            if (body.toLowerCase().toString() == data.questionData.answer.toLowerCase().toString()) return api.sendMessage(`Chúc mừng ${name}, bạn rất thông minh khi trả lời đúng câu hỏi này.`, threadID, () => {
                api.unsendMessage(Reply.messageID);
                clearTimeout(timeOut)
            }, messageID);
            else return api.sendMessage(`${name} bạn rất ngu khi trả lời sai câu hỏi của ${data.name}.\nĐáp án đúng là: ${data.questionData.answer}\n\nBạn đã có mặt trong danh sách ${data.questionData.luotngu + 1} người ngu của câu hỏi này.`, threadID, async() => {
                api.unsendMessage(Reply.messageID);
                await axios.post(`https://impartial-mercury-gum.glitch.me/api/hoingu/${data.ID}&${questionData.questionID}`, { playerID: senderID, name: name });
                clearTimeout(timeOut);
            });
        case "send":
            if (!body) return api.sendMessage(`Bạn phải nhập câu hỏi.`, threadID, messageID);
            api.unsendMessage(Reply.messageID);
            return api.sendMessage(`Câu trả lời đúng của câu hỏi này là gì?\n\nVui lòng reply tin nhắn này câu trả lời đúng với câu hỏi mà bạn vừa đặt ra.`, threadID, (error, info) => {
                multiple.handleMessageReply.push({
                    name: this.info.name,
                    messageID: info.messageID,
                    question: body,
                    type: 'ans',
                    author: senderID
                })
            })
        case "ans":
            if (!body) return api.sendMessage(`Bạn phải nhập câu trả lời cho câu hỏi mà bạn đã đặt ra.`, threadID, messageID);
            api.unsendMessage(Reply.messageID);
            var { question, author } = Reply;
            var { name } = await Users.getData(senderID);
            var { data } = await axios.post(`https://impartial-mercury-gum.glitch.me/api/hoingu`, { ID: senderID, question: question, name: name, answer: body, type: 'newQuestion' });
            console.log(data)
            if (data.status == true) return api.sendMessage(`Câu hỏi của bạn đã được gửi thành công, bạn có thể xem thông tin bằng cách gửi 'hoingu info'.`, threadID, messageID);
            else return api.sendMessage(`Đã có lỗi xảy ra khi gửi câu hỏi của bạn, vui lòng thử lại sau.`, threadID, messageID);
        default:
            break;
    }
}

module.exports.run = async function({ api, args, event, Cherry, Users, multiple }) {
    var axios = require('axios');
    var { threadID, messageID, senderID } = event;
    if (args[0]) {
        switch (args[0]) {
            case "send":
                return api.sendMessage(`Vui lòng reply tin nhắn này với câu hỏi bạn muốn gửi lên sever.`, threadID, (error, info) => {
                    multiple.handleMessageReply.push({
                        name: this.info.name,
                        messageID: info.messageID,
                        type: "send",
                        author: senderID
                    })
                }, messageID);
            case "info":
                var { data } = await axios.post('https://impartial-mercury-gum.glitch.me/api/hoingu', { type: 'info', ID: senderID });
                if (data.status == false) return api.sendMessage(`Đã có lỗi xảy ra khi lấy thông tin của bạn, vui lòng thử lại sau.`, threadID, messageID);
                var ngu = 0;
                if (data.question.length > 0) for (var i of data.question) ngu = i.luotngu + ngu;
                return api.sendMessage(`Cherry Game - Hỏi Ngu\n\nTên người dùng: ${data.name}\nSố câu hỏi: ${data.question.length} câu.\nSố người ngu vì bạn: ${ngu} người.\nBạn đã ngu: ${data.luotngu} lần.`, threadID);
          case "top":
                var { data } = await axios.get('https://impartial-mercury-gum.glitch.me/api/hoingu/top');
                if (!data) return api.sendMessage(`Đã xảy ra lỗi khi lấy dữ liệu từ sever.`, threadID);
                else return api.sendMessage(data, threadID)
            default:
                Cherry.commandError(this.info.name, threadID, messageID);
                break;
        }
    }
    var { data } = await axios.get('https://impartial-mercury-gum.glitch.me/api/hoingu');
    if (!data || data.status && data.status == false) return api.sendMessage(`Đã có lỗi xảy ra khi thực hiện lấy câu hỏi từ sever về cho bạn.`, threadID, messageID);
    var { questionData, name } = data;
    return api.sendMessage(`Bạn nhận được một câu hỏi từ ${name}:\n\n${questionData.question}\n\nSố lượt ngu: ${questionData.luotngu} lượt.\n\nTrả lời câu hỏi này bằng cách reply tin nhắn này kèm câu trả lời.\nNếu không trả lời sau 1 phút, bạn sẽ bị ngu :>`, threadID, (error, info) => {
        var timeOut = setTimeout(async() => {
            api.unsendMessage(info.messageID);
            var { name: playerName } = await Users.getData(senderID);
            api.sendMessage(`${playerName} bạn rất ngu khi không trả lời được câu hỏi này của ${data.name}`, threadID);
            await axios.post(`https://impartial-mercury-gum.glitch.me/api/hoingu/${data.ID}&${questionData.questionID}`, { playerID: senderID, name: playerName });
        }, 60000)
        multiple.handleMessageReply.push({
            author: senderID,
            name: this.info.name,
            messageID: info.messageID,
            data: data,
            type: "answer",
            timeOut: timeOut
        });
    });
}