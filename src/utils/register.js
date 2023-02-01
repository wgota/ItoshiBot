const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../../config.json');
const fs = require('node:fs');

const { logger } = require('../exports');

const commands = [];

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		logger.say(`Reiniciando ${commands.length} comandos da aplicação. (/ commands)`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		logger.say(`${data.length} comandos foram reiniciados. (/ commands)`);
	} catch (error) {
		console.error(error);
	}
})();