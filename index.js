const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const prefix = "=";

const commandList = ["help", "info", "lose", "name", "ping", "win"];

player = {
  playerName: "",
  playerWins: 0,
  playerLosses: 0,
  playerAvg: 0.0,
};

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


  });

client.login(config.BOT_TOKEN);