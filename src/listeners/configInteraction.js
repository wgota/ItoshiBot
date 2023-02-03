const { Events } = require('discord.js');
const { ownerId } = require('../../config.json');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if(interaction){
            
        }
	},
};