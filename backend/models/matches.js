module.exports = {
    matches: function(sequelize, Sequelize){
        const Matches = sequelize.define('matches', {
            player1ID: {
                type: Sequelize.STRING,
                unique: true
            },
            player1name: {
                type: Sequelize.STRING,
            },
            player2ID: {
                type: Sequelize.STRING,
                unique: true
            },
            player2name: {
                type: Sequelize.STRING,
            }
        },
        {
            createdAt: false
        });
        return Matches;
    }
}