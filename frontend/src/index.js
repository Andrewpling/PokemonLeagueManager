const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');

const client = new Discord.Client();

const prefix = "=";

// const commandList = ["died", "help", "info", "killed [number]", "lost [number]", "name [name]", "ping", "register", "reset", "won [number]"];
// const commandDesc = ["Adds deaths to player stats", "Displays list of commands", "Displays player stats", "Adds kills to player stats",
//   "Adds losses to player stats", "Changes player name", "Simple test command to show server response time", "Register player",
//   "Clears player info", "Adds wins to player stats"];

//function to average players' wins and losses
function average(w, l){
  if(w != 0 && l != 0){
    return w/l;
  } 
  else{
    return w;
  }
};

// String.prototype.paddingLeft = function (paddingValue) {
//   return String(paddingValue + this).slice(-paddingValue.length);
// };

// String.prototype.padLeft = function(s, n) {
//   return String.format("%-" + n + "s", s, "%-" + n);  
// }

//function to display a full list of commands
// function displayCommands(){
//   for(var i = 0; i < commandList.length; i++){
//     return `${prefix}${commandList[i]}`;
//   }
// };

client.once('ready', () =>{
  Players.sync();
  Commands.sync({ alter: true });
});

//begins bot functionality
client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // var userPath = '../../backend/UserData.json';
  // var userRead = fs.readFileSync(userPath);
  // var userFile = JSON.parse(userRead); 
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
    else{
      //userFile[userId].name = changeName(userId, args.toString());
      name.changeName(userId, args.toString());
      //fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
      message.reply(`Changed name to ${userFile[userId].name}`);
    }
    //console.log(userFile[userId].name);
    // if (!name.changeName(userId, args.toString())) {
    //   message.reply("User not found. Please register first.")
    // } 
    // else if(name.changeName(userId, args.toString())){
    //   // var newName = args.toString();
    //   // userFile[userId].name = newName.replace(/,/g, ' ');
    //   // fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
    //   // message.reply(`Player name updated to ${userFile[userId].name}!`);
    //   console.log(userFile[userId].name);
    
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

    // if(!userFile[userId]){
    //   message.reply("User not found. Please register first.");
    // } 
    // else{
    //   var numKills = args.toString();
    //   if(isNaN(Number(numKills)))
    //     message.reply(`${numKills} is not a number.`);
    //   else{
    //     userFile[userId].kills += Number(numKills);
    //     message.reply(`Added ${numKills} to your kill count!`);
    //     fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
    //   }
    // }

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
  // {
  //   if(!userFile[userId]){
  //     message.reply("User not found. Please register first.")
  //   } else{
  //     var numDeaths = args.toString();
  //     if(isNaN(Number(numDeaths)))
  //       message.reply(`${numDeaths} is not a number.`);
  //     else{
  //       userFile[userId].deaths += Number(numDeaths);
  //       message.reply(`Added ${numDeaths} to your death count.`);
  //       fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
  //     }
  //   }
  // }

  //display list of player info for a single user
  else if (command === "info"){
    message.reply(`\nPlayer Name: ${userFile[userId].name}\n` + `Kills: ${userFile[userId].kills}\n` + `Deaths: ${userFile[userId].deaths}\n` + `Wins: ${userFile[userId].win}\n` + `Losses: ${userFile[userId].loss}\n` + `W/L Ratio: ${userFile[userId].avg}`);
  }

  //display list of commands
  // else if (command === "help"){
  //   var commands = "";
  //   for(var i = 0; i < commandList.length; i++){
  //     commands = commands + `${prefix}${commandList[i]}: ${commandDesc[i]}\n`;
  //   }
  //   message.channel.send(`\`\`\`${commands}\`\`\``);
  // }
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
    const affectedRows = await Players.update({win: 0, loss: 0, avg: 0, kills: 0, deaths: 0, kd: 0}, {where: {userId: message.author.id}});
    if(affectedRows > 0)
      return message.reply("stats reset");
    return message.reply("something went wrong with resetting stats");
  }
  //   userFile[userId] = {name: "N/A", win: 0, loss: 0, avg: 0, kills: 0, deaths: 0};
  //   fs.writeFileSync(userPath, JSON.stringify(userFile, null, 2));
  //   message.reply("Name and stats reset.");
  // }

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
    // const tagName = args.toString();

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Players.findOne({ where: { userId: message.author.id } });
    if (tag) {
      return message.channel.send(`Name: ${tag.name}\nWins: ${tag.win}\nLosses: ${tag.loss}\nW/L: ${tag.avg}\nKills: ${tag.kills}\nDeaths: ${tag.deaths}\nK/D: ${tag.kd}`);
    }
    return message.reply(`Could not find user`);
  }

  else if (command === "leaderboard"){
    // equivalent to: SELECT name FROM tags;
    const tagList = await Players.findAll({ order:[['win', 'DESC']]});
    // const tagString = tagList.map((t, i) => (`${i+1}. ${t.name}\n      Wins: ${t.win.toString()}\n      Losses: ${t.loss.toString()}\n`) || 'No tags set.');
    const tagString = tagList.map((t, i) => (`${i+1}. ${t.name.padEnd(25)}Win: ${t.win.toString().padEnd(10)}Loss: ${t.loss.toString().padEnd(10)}W/L: ${t.avg.toString().padEnd(10)}Kills: ${t.kills.toString().padEnd(10)}Deaths: ${t.deaths.toString().padEnd(10)}K/D: ${t.kd.toString().padEnd(10)}\n`) || 'No tags set.');
    return message.channel.send((`\`\`\`${tagString}\`\`\``).replace(/,/g, ''));
  }
//   exports.getStaticCompanies = function () {
//     return Company.findAll({
//         where: {
//             id: [46128, 2865, 49569,  1488,   45600,   61991,  1418,  61919,   53326,   61680]
//         }, 
//         // Add order conditions here....
//         order: [
//             ['id', 'DESC'],
//             ['name', 'ASC'],
//         ],
//         attributes: ['id', 'logo_version', 'logo_content_type', 'name', 'updated_at']
//     });
// };
  
});

client.login(config.BOT_TOKEN);