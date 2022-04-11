 module.exports.info = {
	name: "tikvideo",
	version: "1.0.1",
	permissions: 1,
	author: {
		name: "ManhG",
		facebook: ""
	},
	description: {
        long: "Tải video trên Tóp Tóp không Logo",
        short: "Tải video trên Tóp Tóp không Logo"
    },
	group: "Tools",
	guide: [
		'[link video muốn tải]',
	],
	countdown: 5,
	require: {
		  "fs-extra": "",
		  "axios": "",
      "request": ""
	}
};

module.exports.run = async ({ api, event,args, Cherry }) => {  {
	 const { threadID, messageID, senderID, body } = event;

let text = args.join(" ")

  if (!text) return api.sendMessage('Vui nhập link tikvd', event.threadID, event.messageID);

  const length_0 = parseInt(text.length)

 const link = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|")[0];

const res = await axios.get

(`https://manhict.tech/tiktok?link=${link}&apikey=mzkVip_VUCHIENTHANG`);

var url = res.data.data.video_no_watermark;

var tt = res.data.data.title;

	 var callback = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/tkvd.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/tkvd.mp4"),event.messageID);

	 return request(encodeURI(`${url}`)).pipe(fs.createWriteStream(__dirname+'/cache/tkvd.mp4')).on('close',() => callback());     

}}