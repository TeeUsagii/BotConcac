module.exports.info = {
    name: "keobo",
    version: "1.0.0",
    permissions: 1,
    author: {
      name: "Henry - Nguyễn Đức Kiên (DeathOver)",
      facebook:"https://facebook.com/DeathOver.S2T",//Nguyễn Đức Kiên
      facebook: "https://facebook.com./s2.henry"//Henry
      //minigame này có tham khảo qua 1 số file để hoàn thiện
    },
    description: {
      long: "Minigame Kéo Bò Phá Máy",
      short: "Kéo Bò Nhận Tiền"
    },
    group: "Minigame",
    guide: [
          '[Kéo Bò]',
      ],
    countdown: 5,
    require: {
      "axios": "",
      "fs-extra": ""
    }
};

module.exports.run = async function({ api, args, event, Users, Others, multiple, Reply }) {
    const { senderID, threadID } = event;;
    var axios = require("axios");
    if (args[0] == "start") {//Xóa cái điều kiện này đi cũng được
        let imag = (await axios.get("https://i.imgur.com/VYf0UGv.jpg", { responseType: "stream" })).data;
        var msg = { body: 'Ngu Vậy! Thế mà không biết chơi😂', attachment: imag  }
        var so1 = Math.floor(Math.random() * 100);
        let gif = (await axios.get("https://i.ibb.co/7ghrMQj/keobo2.gif", { 
          responseType: "stream" })).data;
        var msg = { body: `Chọn bò:\n1. Tỷ Lệ Kéo Trúng Bò 1 ${so1}%\n\n• Đang Update Thêm....\nReply tin nhắn này với số`, attachment: gif }
        return api.sendMessage(msg, threadID, (error, info) => {
                multiple.handleMessageReply.push({
                name: this.info.name,
                messageID: info.messageID,
                type: 'start',
                author: senderID
            });
        })
    }
}
  
module.exports.handleMessageReply = async function({ api, event, Reply, Cherry }) {//<= Sau chữ function chưa khai báo biến Cherry, tôi đã khai báo rồi
    const { threadID, senderID, messageID, body } = event;
    const { author } = Reply;
    if (author !== senderID) return api.sendMessage('Bạn Không Phải Người Chơi Nên Không Thể Reply Tin Nhắn Này', threadID, messageID);//Để dấu ngoặc nhọn cũng được nhưng lúc code thì không nên => k có tác dụng 
    if (!Cherry.keobo) Cherry.keobo = new Map();
  //Câu đieèu kiện kiểm tra xem đã có dữ liệu ở biến Cherry chưa, nếu chưa có thì tạo
    if(isNaN(body)) return api.sendMessage("Bạn phải nhập một số!", threadID);
    if (0 > body || body > 1) return api.sendMessage("Bạn chỉ có thể chọn 1", threadID, messageID);//Đố ông biết cái này làm gì đấy
  //nó giới hạn con số bé nhất và lớn nhất để chơi
   if(body == "1"){
       thang = "https://i.ibb.co/VH1jcVH/bo1-success.jpg",
       thua = "https://i.ibb.co/JCNFMF1/bo1-fail.jpg"
    }
    
    var msg = (`Bạn đã chọn bò ${body}\nNhập "kéo" để bắt đầu\nvà liên tục nhập "kéo" trong 5s sau đó để kéo bò`);
  
    const keobo = (msg, bo) => api.sendMessage(msg, threadID, (error, info) => {
        Cherry.keobo.set(senderID, {
            spam: 5,
            count: 0,
            bo,
            stt: body,
            author: senderID,
            win: thang,
            lose: thua
         })
    })
  keobo(msg, body.trim())
}

module.exports.handleEvents = async ({ event, api, Users, Others, Cherry }) => {
	const { senderID, threadID, body, messageID } = event;
  var axios = require('axios');
  if (!Cherry.keobo) Cherry.keobo = new Map();//Mâsy cái trên đc rồi đúng k
  //mấy cái trên xong hết rồi
  if (!Cherry.keobo.has(senderID)) return;
  //   if (!([senderID] in Cherry.keobo.set)) return;
  switch (body) {
    case "Kéo":
    case "kéo":
    case "keo":
    case "Keo":
      Cherry.keobo.get(senderID).count++;
      setTimeout(async function() {
        var { name } = await Users.getData(senderID);
        var dataUsers = Cherry.keobo.get(senderID);
        var { win, stt, lose, count } = dataUsers;
        if (stt == 1) {
          var choose = ["true", "false", "false", "false", "false", "true", "true", "false", "true", "false"];
          var ans = choose[Math.floor(Math.random() * choose.length)];
          if (ans == "false" || count < 1) {
            var { data } = await axios.get(lose, { responseType: "stream" });
            var msg = { body: `${name} đã kéo hụt.`, attachment: data };
            return api.sendMessage(msg, threadID, async function() {
              Cherry.keobo.delete(senderID);
            })
          } else {
            var { data } = await axios.get(win, { responseType: "stream" });
            var msg = { body: `${name} đã kéo trúng!`, attachment: data };
            return api.sendMessage(msg, threadID, async function() {
              //cái đoạn này hình như không cần function
              Cherry.keobo.delete(senderID)
            })
          }
        }
      }, 5000)
      //Xong r
  }//quên
}//Xóa cả cái ngoặc của nó đi thế :v