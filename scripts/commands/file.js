module.exports.info = {
  name: "file",
  version: "1.0.1",
  permissions: 1,
  author: {
    name: "Nguyễn Đức Kiên (DeathOver)",//source by D-Jukie
    facebook: "https://facebook.com/DeathOver.S2T"
  },
  description: {
    long: "file [read/write/cre/edit/del/rename]",
    short: "Chỉnh Sửa file và tạo file"
  },
  group: "Admin",
  guide: [
		'[read/write/cre/edit/del/rename]',
	],
  countdown: 5,
  require: {
    "axios": "",
    "fs-extra": "",
    "cheerio": ""
  }
};

module.exports.run = async function({ api, event, args, Cherry, Others }) {
    var axios = require("axios");
    var fs = require("fs-extra");
    var cheerio = require("cheerio");
  var permission = ("100041764608130");
	if (!permission.includes(event.senderID)) return api.sendMessage("Chào bạn chúc bạn một ngày tốt lành😼:))", event.threadID, event.messageID);

    if (args.length == 0) return api.sendMessage("Lỗi cú pháp", event.threadID);
    var path = __dirname + '/';
    if (args[0] == "edit") {
        var newCode = event.body.slice(
            8 + args[1].length + args[0].length,
            event.body.length
        );
        console.log(newCode);
        fs.writeFile(
            `${__dirname}/${args[1]}.js`,
            newCode,
            "utf-8",
            function(err) {
                if (err)
                    return api.sendMessage(
                        `Đã Đã xảy ra lỗi khi áp dụng code mới cho "${args[1]}.js".`
                    );
                api.sendMessage(
                    `Đã áp dụng code mới cho "${args[1]}.js".`,
                    event.threadID,
                    event.messageID
                );
            }
        );
    } else if (args[0] == "read") {
        var data = await fs.readFile(
            `${__dirname}/${args[1]}.js`,
            "utf-8",
            (err, data) => {
                if (err)
                    return api.sendMessage(
                        `Đã xảy ra lỗi khi đọc lệnh "${args[1]}.js".`,
                        event.threadID,
                        event.messageID
                    );
                api.sendMessage(data, event.threadID, event.messageID);
            }
        );
    }
    else if (args[0] == "-r") {
        var data = await fs.readFile(
            `${__dirname}/${args[1]}.js`,
            "utf-8",
            (err, data) => {
                if (err)
                    return api.sendMessage(
                        `Đã xảy ra lỗi khi đọc lệnh "${args[1]}.js".`,
                        event.threadID,
                        event.messageID
                    );
                api.sendMessage(data, event.threadID, event.messageID);
            }
        );
    } else if (args[0] == "cre") {
        if (args[1].length == 0) return api.sendMessage("Chưa đặt tên cho modules", event.threadID);
        if (fs.existsSync(`${__dirname}/${args[1]}.js`))
            return api.sendMessage(
                `${args[1]}.js đã tồn tại.`,
                event.threadID,
                event.messageID
            );
        fs.copySync(__dirname + "/file-alpha.js", __dirname + "/" + args[1] + ".js");//file mẫu để create
        return api.sendMessage(
            `Đã tạo thành công tệp "${args[1]}.js".\n\n» Sài #file read ${args[1]} để viết code vào file bạn vừa tạo!`,
            event.threadID,
            event.messageID
        );
    }
     else if (args[0] == "del") {
        fs.unlink(`${__dirname}/${args[1]}.js`);
        return api.sendMessage(`Đã xoá file có tên "${args[1]}.js".`, event.threadID, event.messageID)
    } 
    else if (args[0] == "rename") {
        fs.rename(`${__dirname}/${args[1]}.js`, `${__dirname}/${args[2]}.js`, function(err) {
            if (err) throw err;
            return api.sendMessage(
                `Đã đổi tên thành công tệp "${args[1]}.js" thành "${args[2]}.js".`,
                event.threadID,
                event.messageID)
        });
    }
}
