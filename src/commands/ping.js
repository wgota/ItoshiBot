const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping Pong"),
    async execute (interaction) {
        return await interaction.reply({ content: "Pong", ephemeral: true });
    }
}