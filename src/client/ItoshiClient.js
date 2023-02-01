const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 });
const path = require('path');
const fs = require('fs');

const { logger, Embed, data } = require('../exports');
client.embed = Embed;

require('../utils/register');

// Commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Listeners
const listenersPath = path.join(__dirname, '../listeners');
const listenerFiles = fs.readdirSync(listenersPath).filter(file => file.endsWith('.js'));

for (const file of listenerFiles) {
	const filePath = path.join(listenersPath, file);
	const listener = require(filePath);
	if (listener.once) {
		client.once(listener.name, (...args) => listener.execute(...args));
	} else {
		client.on(listener.name, (...args) => listener.execute(...args));
	}
}

// Database
(async () => {
	await data.Database.authenticate();
	client.database = data;
})();

module.exports = client;