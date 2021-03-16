const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');




/*const fs = require('fs') //importing file save
var userPath = 'file path to json here'
var userRead = fs.readFileSync(userPath
);
var userFile = JSON.parse(userRead); //ready for use
var userId = message.author.id //user id here
if (!userFile[userId]) { //this checks if data for the user has already been created
    userFile[userId] = {xpp: 0, xppr: 0, currentRole: ""}; //if not, create it
    fs.writeFileSync(userPath
    , JSON.stringify(userFile, null, 2));
} else {
    //as an example, I will give the owner of the id 50 xp and the role "Awesome Role"
    var xppVar = Number(userFile.xpp) + 50 //add 50 to their original xp
    var xpprVar = Number(userFile.xppr)
    var roleToGive = "Awesome Role"
    userFile[userId] = {xpp: xppVar, xppr: xpprVar, currentRole: roleToGive};
    fs.writeFileSync(userPath
    , JSON.stringify(userFile, null, 2));
    console.log(`Changed that player's xp to ${xppVar} and gave him the role ${roleToGive}`)

}*/

const client = new Discord.Client();

const prefix = "=";

const commandList = ["help", "info", "lose", "name", "ping", "win"];

player = {
  playerName: "",
  playerWins: 0,
  playerLosses: 0,
  playerAvg: 0.0,
};

/* else {
  //as an example, I will give the owner of the id 50 xp and the role "Awesome Role"
  var xppVar = Number(userFile.xpp) + 50 //add 50 to their original xp
  var xpprVar = Number(userFile.xppr)
  var roleToGive = "Awesome Role"
  userFile[userId] = {xpp: xppVar, xppr: xpprVar, currentRole: roleToGive};
  fs.writeFileSync(userPath
  , JSON.stringify(userFile, null, 2));
  console.log(`Changed that player's xp to ${xppVar} and gave him the role ${roleToGive}`)

}*/

function reset(){
  player.playerWins = 0;
  player.playerLosses = 0;
  player.playerAvg = 0;
};

function average(){
  if(player.playerWins != 0 && player.playerLosses != 0){
    player.playerAvg = player.playerWins / player.playerLosses;
  }
};

function displayCommands(){
  for(var i = 0; i < commandList.length; i++){
    return `${prefix}${commandList[i]}`;
  }
};


client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
      }

    else if (command === "name") {
      const name = args.toString();
      player.playerName = name;
      reset();
      message.reply(`Player name updated to ${player.playerName}!`);
    }

    else if (command === "win"){
      const name = args.toString();
      player.playerWins++;
      average();
      message.reply(`Congrats, ${player.playerName}, you now have ${player.playerWins} total wins!`);
    }

    else if (command === "lose"){
      const name = args.toString();
      player.playerLosses++;
      average();
      message.reply(`Too bad, ${player.playerName}, you now have ${player.playerLosses} total losses.`);
    }

    else if (command === "info"){
      message.reply(`Player Name: ${player.playerName}\n` + `Wins: ${player.playerWins}\n` + `Losses: ${player.playerLosses}\n` + `W/L Ratio: ${player.playerAvg}`);
    }

    else if (command === "help"){
      var commands = "";
      for(var i = 0; i < commandList.length; i++){
        //return `${prefix}${commandList[i]}`;
        commands = commands + `${prefix}${commandList[i]}\n`;
      }
      message.channel.send('**' + commands + '**');
      
    }

    else if (command === "register"){
      var userPath = '../../backend/UserData.json';
      var userRead = fs.readFileSync(userPath);
      var userFile = JSON.parse(userRead);
      var userId = message.author.id;
      if (!userFile[userId]) { //this checks if data for the user has already been created
        userFile[userId] = {name: "", win: 0, loss: 0}; //if not, create it
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        message.reply("You have been registered!");
      }
      else{
        message.reply("User already registered")
      }
    }


  });

client.login(config.BOT_TOKEN);