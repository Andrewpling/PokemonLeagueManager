// const Discord = require('discord.js');
// const Sequelize = require('sequelize');
// // const { sequelize } = require('../index.js');


// module.exports = {
    

//     matchMake: function(Matches, Players, sequelize){
//         const n = 0;
//         const p = Players.findAll({attributes: ['userId', 'name']});
//         const pList = p.map((t, i) => {
//             if(n == 0){
//                 Matches.create({
//                     player1ID: p.userId,
//                     player1name: p.name
//                 })
//                 n++;
//             }
//             if(n == 1){
//                 Matches.update({player2ID: p.userId, player2name: p.name})
//             }
//         }
//         console.log("hi");
//         return console.log();
        
//     }
// }


