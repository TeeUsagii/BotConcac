//Bắt buộc phải có
module.exports.info = {
	name: "Tên Lệnh",
	version: "Phiên Bản Của Lệnh",
	permissions: 1,
	author: {
		name: "Tên Bạn",
		facebook: "Link FB hoặc để trống"
	},
	description: {
        long: "Sẽ hiện khi người dùng sử dụng help + tên lệnh",
        short: "Sẽ hiện khi người dùng sử dụng help"
    },
	group: "Nhóm lệnh",
	guide: ['Hướng dẫn', 'Hướng dẫn'],
	countdown: 5, //Thời gian mà một người có thể sử dụng lại lệnh.
    require: {
        "key": "version"
    }
};

module.exports.run = async function({ api, Cherry, event, multiple, args, Users, Threads, Others, permission, prefix }) {
    //Function này được gọi khi người dùng sử dụng đúng tên lệnh
}

//Nếu cần thiết
module.exports.handleEvents = async function({ event, api, Cherry, multiple, Users, Threads, Others }) {
    //Function này được gọi khi có một event mới
}

module.exports.handleMessageReply = async function({ api, Cherry, multiple, event, Users, Threads, Others, Reply }) {
    //Function này được gọi khi người dùng reply tin nhắn
    //Với điều kiện trong multiple.handleMessageReply có thuộc tính chứa ID của tin nhắn và tên lệnh này.
    //Biến Reply chứa các dữ liệu mà tin nhắn đó cần để thực thi
}

module.exports.handleReactionMessgae = async function({ api, Cherry, multiple, event, Users, Threads, Others, Reaction }) {
    //Function này được gọi khi người dùng thả cảm xúc vào tin nhắn
    //Với điều kiện trong multiple.handleReactionMessage có thuộc tính chứa ID của tin nhắn và tên lệnh này.
    //Biến Reaction chứa các dữ liệu mà tin nhắn đó cần để thực thi
}

module.exports.onLoad = async function({ Cherry, multiple }) {
    //Mọi thứ trong function này sẽ được thực thi trước khi Bot được đăng nhập
}