const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');
//database test
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: '../../backend/database.sqlite',
});

const Players = sequelize.define('players2', {
  userId: {
    type: Sequelize.STRING,
    unique: true,
  },
	name: {
		type: Sequelize.STRING
    //new value, check this one if db breaks
	},
	win: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
  loss: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
  avg: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
  kills: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
  deaths: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
  kd: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

const client = new Discord.Client();

const prefix = "=";

const commandList = ["died", "help", "info", "killed [number]", "lost [number]", "name [name]", "ping", "register", "reset", "won [number]"];
const commandDesc = ["Adds deaths to player stats", "Displays list of commands", "Displays player stats", "Adds kills to player stats",
  "Adds losses to player stats", "Changes player name", "Simple test command to show server response time", "Register player",
  "Clears player info", "Adds wins to player stats"];

//function to average players' wins and losses
function average(w, l){
  if(w != 0 && l != 0){
    return (w/l).toFixed(2);
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

client.once('ready', () =>{
  Players.sync();
});

//begins bot functionality
client.on("message", async message => {
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
    // if (!userFile[userId]) {
    //   message.reply("User not found. Please register first.")
    // } 
    // else {
    //   var newName = args.toString();
    //   userFile[userId].name = newName.replace(/,/g, ' ');
    //   fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
    //   message.reply(`Player name updated to ${userFile[userId].name}!`);
    // }
    const newName = args.toString();
    const affectedRows = await Players.update({ name: newName.replace(/,/g, ' ') }, { where: { userId: message.author.id }});
    if(affectedRows > 0){
      return message.reply(`Changed name to ${newName.replace(/,/g, ' ')}`);
    }
    return message.reply("User not found. Please register first.");
  }

  //command to add a win
  else if (command === "won"){
    const numWins = args.toString();
    if(isNaN(Number(numWins)))
      return message.reply(`${numWins} is not a number`);
    else{
      const player = await Players.findOne({where: {userId : message.author.id}});
      const newNum = player.win + Number(numWins);
      const affectedRows = await Players.update({ win: newNum, avg: average(newNum, player.loss)}, { where: { userId: message.author.id}});
      if(affectedRows > 0){
        if(Number(numWins) < 0)
          return message.reply(`subtracted ${numWins.replace(/-/g, '')} wins`);
        else
          return message.reply(`added ${numWins} wins`);
      }
      return message.reply("User not found. Please register first.");
    }
  }
    
    // if (!userFile[userId]) {
    //   message.reply("User not found. Please register first.");
    // } 
    //else {
      /*userFile[userId].win = userFile[userId].win + 1;
      userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
      fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
      message.reply(`Congrats, ${userFile[userId].name}, you now have ${userFile[userId].win} total wins!`);
    }*/
    // else{
    //   var numWins = args.toString();
    //   if(isNaN(Number(numWins)))
    //     message.reply(`${numWins} is not a number.`);
    //   else{
    //     userFile[userId].win += Number(numWins);
    //     userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
    //     message.reply(`Added ${numWins} to your win count!`);
    //     fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
    //   }
    // }

  //command to add a loss
  else if (command === "lost"){
    const numLosses = args.toString();
    if(isNaN(Number(numLosses)))
      return message.reply(`${numLosses} is not a number`);
    else{
      const player = await Players.findOne({where: {userId : message.author.id}});
      const newNum = (player.loss + Number(numLosses));
      const affectedRows = await Players.update({ loss: newNum, avg: average(player.win, newNum) }, { where: { userId: message.author.id}});
      if(affectedRows > 0){
        if(Number(numLosses) < 0)
          return message.reply(`subtracted ${numLosses.replace(/-/g, '')} losses`);
        else
          return message.reply(`added ${numLosses} losses`);
      }
      return message.reply("User not found. Please register first.");
    }
  }
  // else if (command === "lost"){
  //   if (!userFile[userId]) {
  //     message.reply("User not found. Please register first.")
  //   } 
  //   else{
  //     var numLosses = args.toString();
  //     if(isNaN(Number(numLosses)))
  //       message.reply(`${numLosses} is not a number.`);
  //     else{
  //       userFile[userId].loss += Number(numLosses);
  //       userFile[userId].avg = average(userFile[userId].win, userFile[userId].loss);
  //       message.reply(`Added ${numLosses} to your loss count.`);
  //       fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
  //     }
  //   }
  // }

  //add one kill or more to player stats
  else if (command === "killed"){
    if(!userFile[userId]){
      message.reply("User not found. Please register first.");
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
    const playerName = args.toString().replace(/,/g, ' ');;

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Players.findOne({ where: { name: playerName } });
    if (tag) {
      return message.channel.send(`Name: ${tag.name}\nWins: ${tag.win}\nLosses: ${tag.loss}\nW/L: ${tag.avg}\nKills: ${tag.kills}\nDeaths: ${tag.deaths}\nK/D: ${tag.kd}`);
    }
    return message.reply(`Could not find user`);
  }

  //display list of commands
  else if (command === "help"){
    var commands = "";
    for(var i = 0; i < commandList.length; i++){
      commands = commands + `${prefix}${commandList[i]}: ${commandDesc[i]}\n`;
    }
    message.channel.send(`\`\`\`${commands}\`\`\``);
  }

  //command to register a user if not already registered
  else if (command === "register"){
    console.log("register");
    const newName = message.author.username;
    try {
      // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
      const tag = await Players.create({
        userId: userId,
        name: newName,
      });
      return message.reply(` ${tag.name} registered.`);
    }
    catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        message.reply('You have already registered.');
      }
      else
        message.reply('Something went wrong with adding a player');

    }
  }

  //command to clear player data
  else if (command === "reset"){
    userFile[userId] = {name: "N/A", win: 0, loss: 0, avg: 0, kills: 0, deaths: 0};
    fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
    message.reply("Name and stats reset.");
  }

  else if (command === "unregister"){
    console.log("Hello");
    // const tagName = args.toString();
    const rowCount = await Players.destroy({ where : { userId: message.author.id }});
    if(rowCount == false){
      return message.reply("That player does not exist");
    }
    return message.reply("player deleted");
  }


  else if (command === "myinfo"){
    console.log("tagInfo");
    // const tagName = args.toString();

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Players.findOne({ where: { userId: message.author.id } });
    if (tag) {
      return message.channel.send(`Name: ${tag.name}\nWins: ${tag.win}\nLosses: ${tag.loss}\nW/L: ${tag.avg}\nKills: ${tag.kills}\nDeaths: ${tag.deaths}\nK/D: ${tag.kd}`);
    }
    return message.reply(`Could not find user`);
  }

  else if (command === "listplayers"){
    // equivalent to: SELECT name FROM tags;
    const tagList = await Players.findAll({ attributes: ['name'] });
    const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    return message.channel.send(`List of tags: ${tagString}`);
  }

  
});

client.login(config.BOT_TOKEN);