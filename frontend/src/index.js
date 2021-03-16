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
        message.reply("User not found. Please register first.") //this checks if data for the user has already been created
      } else {
      var newName = args.toString();
      userFile[userId].name = newName;
      fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
      message.reply(`Player name updated to ${userFile[userId].name}!`);
      }
    }

    //command to add a win
    else if (command === "win"){
      //var userId = message.author.id;
      if (!userFile[userId]) {
        message.reply("User not found. Please register first.") //this checks if data for the user has already been created
      } else {
        //as an example, I will give the owner of the id 50 xp and the role "Awesome Role"
        //var nameVar = String(userFile[userId].name); //add 50 to their original xp
        //var winVar = Number(userFile[userId].win) + 1;
        //var lossVar = Number(userFile[userId].loss);
        //userFile[userId] = {name: nameVar, win: winVar, loss: lossVar};
        userFile[userId].win = userFile[userId].win + 1;
        userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        //console.log(`Changed that player's xp to ${xppVar} and gave him the role ${roleToGive}`)
    
    
      /*const name = message.author.id;
      player.playerWins++;
      average();*/
        message.reply(`Congrats, ${userFile[userId].name}, you now have ${userFile[userId].win} total wins!`);
        
      }
    }

    //command to add a loss
    else if (command === "lose"){
      if (!userFile[userId]) {
        message.reply("User not found. Please register first.") //this checks if data for the user has already been created
      } else {
        userFile[userId].loss = userFile[userId].loss + 1;
        userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        message.reply(`That's too bad, ${userFile[userId].name}, you now have ${userFile[userId].loss} losses.`)
        //average(userFile, userId);
      }
      
    }

    //display list of player info for a single user
    else if (command === "info"){
      message.reply(`\nPlayer Name: ${userFile[userId].name}\n` + `Wins: ${userFile[userId].win}\n` + `Losses: ${userFile[userId].loss}\n` + `W/L Ratio: ${userFile[userId].avg}`);
    }

    else if (command === "help"){
      var commands = "";
      for(var i = 0; i < commandList.length; i++){
        //return `${prefix}${commandList[i]}`;
        commands = commands + `${prefix}${commandList[i]}\n`;
      }
      message.channel.send('**' + commands + '**');
      
    }

    //command to register a user
    else if (command === "register"){
      var userPath = '../../backend/UserData.json';
      var userRead = fs.readFileSync(userPath);
      var userFile = JSON.parse(userRead);
      var userId = message.author.id;
      if (!userFile[userId]) { //this checks if data for the user has already been created
        userFile[userId] = {name: "N/A", win: 0, loss: 0}; //if not, create it
        fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
        message.reply("You have been registered!");
      }
      else{
        message.reply("User already registered")
      }
    }

    //command to clear player data
    else if (command === "reset"){
      userFile[userId] = {name: "N/A", win: 0, loss: 0, avg: 0};
      fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
      message.reply("Name and stats reset.")
    }


  });

client.login(config.BOT_TOKEN);