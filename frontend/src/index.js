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

const Commands = sequelize.define('commands', {
  commandName: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  }
},
{
  createdAt: false,
  updatedAt: false
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
		allowNull: true,
	},
  loss: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
  avg: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
  kills: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
  deaths: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
  kd: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
});

const client = new Discord.Client();

const prefix = "=";

//function to average players' wins and losses
function average(w, l){
  if(w != 0 && l != 0){
    return (w/l).toFixed(2);
  } 
  else{
    return w;
  }
};


client.once('ready', () =>{
  Players.sync();
  Commands.sync({ alter: true });
});

//begins bot functionality
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  //test command to ping the server and display response time
  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  //command to change your username
  else if (command === "name") {
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
    if(isNaN(Number(numWins))){
      return message.reply(`${numWins} is not a number`);
    }
    else{
      const player = await Players.findOne({where: {userId : message.author.id}});
      if(player){
        const newNum = player.win + Number(numWins);
        const affectedRows = await Players.update({ win: newNum, avg: average(newNum, player.loss)}, { where: { userId: message.author.id}});
        if(affectedRows > 0){
          if(Number(numWins) < 0)
            return message.reply(`subtracted ${numWins.replace(/-/g, '')} wins`);
          else
            return message.reply(`added ${numWins} wins`);
        }
      }
    }
    return message.reply("User not found. Please register first.");
  }
    

  //command to add a loss
  else if (command === "lost"){
    const numLosses = args.toString();
    if(isNaN(Number(numLosses)))
      return message.reply(`${numLosses} is not a number`);
    else{
      const player = await Players.findOne({where: {userId : message.author.id}});
      if(player){

        const newNum = (player.loss + Number(numLosses));
        const affectedRows = await Players.update({ loss: newNum, avg: average(player.win, newNum) }, { where: { userId: message.author.id}});
        if(affectedRows > 0){
          if(Number(numLosses) < 0)
            return message.reply(`subtracted ${numLosses.replace(/-/g, '')} losses`);
          else
            return message.reply(`added ${numLosses} losses`);
        }
      }
      return message.reply("User not found. Please register first.");
    }
  }

  //add one kill or more to player stats
  else if (command === "killed"){
    const numKills = args.toString();
    if(isNaN(Number(numKills)))
      return message.reply(`${numKills} is not a number`);
    else{
      const player = await Players.findOne({where: {userId : message.author.id}});
      if(player){
        const newNum = (player.kills + Number(numKills));
        console.log(newNum);
        console.log(average(newNum, player.deaths));
        const affectedRows = await Players.update({ kills: newNum, kd: average(newNum, player.deaths)}, { where: { userId: message.author.id}});

        if(affectedRows > 0){
          if(Number(numKills) < 0)
            return message.reply(`subtracted ${numKills.replace(/-/g, '')} kills`);
          else
            return message.reply(`added ${numKills} kills`);
        }
      }  
    }
    return message.reply("User not found. Please register first.");
  }



  //adds one death or more to player stats
  else if (command === "died"){
    const numDeaths = args.toString();
    if(isNaN(Number(numDeaths)))
      return message.reply(`${numDeaths} is not a number`);
    else{
      const player = await Players.findOne({where: {userId : message.author.id}});
      if(player){
        const newNum = player.deaths + Number(numDeaths);
        const affectedRows = await Players.update({ deaths: newNum, kd: average(player.kills, newNum)}, { where: { userId: message.author.id}});
        if(affectedRows > 0){
          if(Number(numDeaths) < 0)
            return message.reply(`subtracted ${numDeaths.replace(/-/g, '')} deaths`);
          else
            return message.reply(`added ${numDeaths} deaths`);
        }
      }
      return message.reply("User not found. Please register first.");  
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

  else if(command === "help"){
    const com = await Commands.findAll({ attributes: ['commandName', 'description']}, {order: ['commandName', 'DESC']});
    console.log(com.commandName);
    const helpList = com.map(t => (`${t.commandName.padEnd(20)}${t.description}\n`)) || 'Error';
    message.channel.send((`\`\`\`Command List: \n\n${helpList}\`\`\``).replace(/,/g, ''));
  }

  //command to register a user if not already registered
  else if (command === "register"){
    console.log("register");
    const newName = message.author.username;
    try {
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
    const affectedRows = await Players.update({win: 0, loss: 0, avg: 0, kills: 0, deaths: 0, kd: 0}, {where: {userId: message.author.id}});
    if(affectedRows > 0)
      return message.reply("stats reset");
    return message.reply("something went wrong with resetting stats");
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
    const tag = await Players.findOne({ where: { userId: message.author.id } });
    if (tag) {
      return message.channel.send(`Name: ${tag.name}\nWins: ${tag.win}\nLosses: ${tag.loss}\nW/L: ${tag.avg}\nKills: ${tag.kills}\nDeaths: ${tag.deaths}\nK/D: ${tag.kd}`);
    }
    return message.reply(`Could not find user`);
  }

  else if (command === "leaderboard"){
    const tagList = await Players.findAll({ order:[['win', 'DESC']]});
    const tagString = tagList.map((t, i) => (`${i+1}. ${t.name.padEnd(25)}Win: ${t.win.toString().padEnd(10)}Loss: ${t.loss.toString().padEnd(10)}W/L: ${t.avg.toString().padEnd(10)}Kills: ${t.kills.toString().padEnd(10)}Deaths: ${t.deaths.toString().padEnd(10)}K/D: ${t.kd.toString().padEnd(10)}\n`) || 'No tags set.');
    return message.channel.send((`\`\`\`${tagString}\`\`\``).replace(/,/g, ''));
  }
  
});

client.login(config.BOT_TOKEN);