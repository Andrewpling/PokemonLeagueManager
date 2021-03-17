const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');

const client = new Discord.Client();

const prefix = "=";

const commandList = ["help", "info", "lose", "name", "ping", "register", "reset", "win"];

//function to average players' wins and losses
function average(w, l){
  if(w != 0 && l != 0){
    return w/l;
  } 
  else{
    return w;
  }
};

//function to display a full list of commands
function displayCommands(){
  for(var i = 0; i < commandList.length; i++){
    return `${prefix}${commandList[i]}`;
  }
};

//begins bot functionality
client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    var userPath = '../../backend/UserData.json';
    var userRead = fs.readFileSync(userPath);
    var userFile = JSON.parse(userRead); 
    var userId = message.author.id;

    //test command to ping the server and display response time
    if (command === "ping") {
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }

    //command to change your username
    else if (command === "name") {
      if (!userFile[userId]) {
        message.reply("User not found. Please register first.")
      } 
      else {
        var newName = args.toString();
        userFile[userId].name = newName.replace(/,/g, ' ');
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        message.reply(`Player name updated to ${userFile[userId].name}!`);
      }
    }

    //command to add a win
    else if (command === "won"){
      if (!userFile[userId]) {
        message.reply("User not found. Please register first.")
      } 
      //else {
        /*userFile[userId].win = userFile[userId].win + 1;
        userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        message.reply(`Congrats, ${userFile[userId].name}, you now have ${userFile[userId].win} total wins!`);
      }*/
      else{
        var numWins = args.toString();
        if(isNaN(Number(numWins)))
          message.reply(`${numWins} is not a number.`);
        else{
          userFile[userId].win += Number(numWins);
          userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
          message.reply(`Added ${numWins} to your win count!`);
          fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        }
      }
    }

    //command to add a loss
    else if (command === "lost"){
      if (!userFile[userId]) {
        message.reply("User not found. Please register first.")
      } 
      else{
        var numLosses = args.toString();
        if(isNaN(Number(numLosses)))
          message.reply(`${numLosses} is not a number.`);
        else{
          userFile[userId].loss += Number(numLosses);
          userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
          message.reply(`Added ${numLosses} to your loss count.`);
          fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        }
      }
    }

    //add one kill or more to player stats
    else if (command === "killed"){
      if(!userFile[userId]){
        message.reply("User not found. Please register first.")
      } 
      else{
        var numKills = args.toString();
        if(isNaN(Number(numKills)))
          message.reply(`${numKills} is not a number.`);
        else{
          userFile[userId].kills += Number(numKills);
          message.reply(`Added ${numKills} to your kill count!`);
          fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        }
      }
    }

    //adds one death or more to player stats
    else if (command === "died"){
      if(!userFile[userId]){
        message.reply("User not found. Please register first.")
      } else{
        var numDeaths = args.toString();
        if(isNaN(Number(numDeaths)))
          message.reply(`${numDeaths} is not a number.`);
        else{
          userFile[userId].deaths += Number(numDeaths);
          message.reply(`Added ${numDeaths} to your death count.`);
          fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        }
      }
    }

    //display list of player info for a single user
    else if (command === "info"){
      message.reply(`\nPlayer Name: ${userFile[userId].name}\n` + `Kills: ${userFile[userId].kills}\n` + `Deaths: ${userFile[userId].deaths}\n` + `Wins: ${userFile[userId].win}\n` + `Losses: ${userFile[userId].loss}\n` + `W/L Ratio: ${userFile[userId].avg}`);
    }
    else if (command === "help"){
      var commands = "";
      for(var i = 0; i < commandList.length; i++){
        commands = commands + `${prefix}${commandList[i]}\n`;
      }
      message.channel.send('**' + commands + '**');
    }

    //command to register a user if not already registered
    else if (command === "register"){
      var userPath = '../../backend/UserData.json';
      var userRead = fs.readFileSync(userPath);
      var userFile = JSON.parse(userRead);
      var userId = message.author.id;
      if (!userFile[userId]) {
        userFile[userId] = {name: "N/A", win: 0, loss: 0, avg: 0, kills: 0, deaths: 0};
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        message.reply("You have been registered!");
      }
      else{
        message.reply("User already registered")
      }
    }

    //command to clear player data
    else if (command === "reset"){
      userFile[userId] = {name: "N/A", win: 0, loss: 0, avg: 0, kills: 0, deaths: 0};
      fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
      message.reply("Name and stats reset.")
    }
  });

client.login(config.BOT_TOKEN);