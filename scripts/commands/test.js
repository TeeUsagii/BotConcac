module.exports.info = {
	name: "test",
	version: "1.0.0",
	permissions: 2,
	author: {
		name: "Henry",
		facebook: "https://facebook.com/s2.henry"
	},
	description: {
        long: "Để test thôi",
        short: "Để test lệnh"
    },
	group: "system",
	guide: [
		'',
	],
	countdown: 5
};

module.exports.run = async function({ api, Cherry, multiple }) {
  console.log(multiple.handleMessageReply)
}