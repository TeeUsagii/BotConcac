module.exports.info = {
	name: "morse",
	version: "1.0.0",
	permissions: 0,
	author: {
		name: "Drasew",
		facebook: "https://facebook.com/100077870917015"
	},
	description: {
        long: "Hong biết nữa",
        short: "Mã hóa văn bản thành mã morse"
    },
	group: "change font",
	guide: [
		'',
	],
	countdown: 5
};

module.exports.run = async function({ event, api, args }) {
 const { threadID, messageID } = event;
    var content = args.join(" ").toLowerCase();;
     		if (!content) return api.sendMessage(`Vui lòng nhập vă bản để mã hóa thành mã morse.`,event.threadID,event.messageID);
    let msgtext = content.replace(/a/gi, ".-")
      .replace(/â/gi, ".--.-")
      .replace(/b/gi, "-...")
      .replace(/c/gi, "-.-.")
      .replace(/d/gi, "-..")
      .replace(/e/gi, ".")
      .replace(/ê/gi, "-..-.")
      .replace(/f/gi, "..-.")
      .replace(/g/gi, "--.")
      .replace(/h/gi, "....")
      .replace(/i/gi, "..")
      .replace(/j/gi, ".---")
      .replace(/k/gi, "-.-")
      .replace(/l/gi, ".-..")
      .replace(/m/gi, "--")
      .replace(/n/gi, "-.")
      .replace(/o/gi, "---")
      .replace(/ô/gi, "---.")
      .replace(/p/gi, ".--.")
      .replace(/q/gi, "--.-")
      .replace(/r/gi, ".-.")
      .replace(/s/gi, "...")
      .replace(/t/gi, "-")
      .replace(/u/gi, "..-")
      .replace(/v/gi, "...-")
      .replace(/w/gi, ".--")
      .replace(/x/gi, "-..-")
      .replace(/y/gi, "	-.--")
      .replace(/z/gi, "--..");;
    return api.sendMessage(msgtext, threadID,messageID);
}