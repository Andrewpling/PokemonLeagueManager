// const { Discord } = require("discord.js");
// const config = require("config.json");
// const fs = require('fs');

const commandList = ["died", "help", "info", "killed [number]", "lost [number]", "name [name]", "ping", "register", "reset", "won [number]"];
const commandDesc = ["Adds deaths to player stats", "Displays list of commands", "Displays player stats", "Adds kills to player stats",
  "Adds losses to player stats", "Changes player name", "Simple test command to show server response time", "Register player",
  "Clears player info", "Adds wins to player stats"];

module.exports = {

//function displayCommands(Discord){
  displayCommands: function(){

  var prefix = '=';
  var commands = "";
  for(var i = 0; i < commandList.length; i++){
    commands = commands + `${prefix}${commandList[i]}: ${commandDesc[i]}\n`;
  }
  return commands;
     //Discord.message.channel.send(`\`\`\`${commands}\`\`\``);
    
  }    
}
//exports.function = displayCommands();