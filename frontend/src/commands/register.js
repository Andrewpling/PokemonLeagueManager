//const user = require('../../../backend/UserData.json');
const Discord = require("discord.js");
const fs = require('fs');
const config = require('../config.json');

var userPath = '../../../backend/UserData.json';
var userRead = fs.readFileSync(userPath);

var userFile = JSON.parse(userRead);

module.exports = {
    register: function(user){
        // const userPath = '../../../backend/UserData.json';
        // const userRead = fs.readFileSync('..\..\..\backend\UserData.json');
        // const userFile = JSON.parse(userRead);
        const userId = user;
        if(!userFile[userId]){
            userFile[userId] = {name: "N/A", win: 0, loss: 0, avg: 0, kills: 0, deaths: 0};
            fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
            return true;
        }
        else
            return false;
    }
}