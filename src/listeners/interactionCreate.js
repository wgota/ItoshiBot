const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) return;

        if(command.developer && interaction.user.id !== "665589500860301315") return;
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui encontrar execute este comando.', ephemeral: true });
        }
	},
};