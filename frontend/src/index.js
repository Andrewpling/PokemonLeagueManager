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

const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
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

client.once('ready', () =>{
  Tags.sync();
});

//begins bot functionality
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const input = message.content.slice(prefix.length).trim().split(' ');
  const command = input.shift();
  const commandArgs = input.join(' ');

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

  //database test methods

  else if (command === "addTag"){
    const splitArgs = commandArgs.split(' ');
    const tagName = splitArgs.shift();
    const tagDescription = splitArgs.join(' ');

    try {
      // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
      const tag = await Tags.create({
        name: tagName,
        description: tagDescription,
        username: message.author.username,
      });
      return message.reply(`Tag ${tag.name} added.`);
    }
    catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return message.reply('That tag already exists.');
      }
      return message.reply('Something went wrong with adding a tag.');
    }
  }
  else if (command === "fetchTag"){
    const tagName = commandArgs;

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
      // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
      tag.increment('usage_count');
      return message.channel.send(tag.get('description'));
    }
    return message.reply(`Could not find tag: ${tagName}`);
  }

  else if (command == "editTag"){
    const splitArgs = commandArgs.split(' ');
    const tagName = splitArgs.shift();
    const tagDescription = splitArgs.join(' ');

    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
    if (affectedRows > 0) {
      return message.reply(`Tag ${tagName} was edited.`);
    }
    return message.reply(`Could not find a tag with name ${tagName}.`);
  }

  else if (command === "tagInfo"){
    const tagName = commandArgs;

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
      return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
    }
    return message.reply(`Could not find tag: ${tagName}`);
  }

  else if (command === "listTags"){
    // equivalent to: SELECT name FROM tags;
    const tagList = await Tags.findAll({ attributes: ['name'] });
    const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    return message.channel.send(`List of tags: ${tagString}`);
  }

  else if (command === "deleteTag"){
    const tagName = commandArgs;
    // equivalent to: DELETE from tags WHERE name = ?;
    const rowCount = await Tags.destroy({ where: { name: tagName } });
    if (!rowCount) return message.reply('That tag did not exist.');

    return message.reply('Tag deleted.');
  }
});

client.login(config.BOT_TOKEN);