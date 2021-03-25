const Discord = require("discord.js");
const fs = require('fs');
const { userInfo } = require("os");
const config = require('../config.json');

var userPath = '../../backend/UserData.json';
var userRead = fs.readFileSync(userPath);
var userFile = JSON.parse(userRead);

// console.log(userFile[userId]);

module.exports = {

    changeName: function(userId, newName){
        userFile[userId].name = newName.replace(/,/g, ' ');
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
//    console.log(userFile[userId]);
//         if (!userFile[userId]) {
//             // message.reply("User not found. Please register first.")
//             return false;
//         }
//         else {
//             // var newName = args.toString();
//             userFile[userId].name = newName.replace(/,/g, ' ');
//             fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
//             return true;
//         }
//     }
    
}
}


