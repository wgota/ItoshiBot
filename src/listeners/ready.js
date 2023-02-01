const { Events } = require('discord.js');
const { logger } = require('../exports');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.say("Client iniciado com sucesso.");
	}
};