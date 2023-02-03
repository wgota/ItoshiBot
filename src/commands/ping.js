const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping Pong")
        .setDMPermission(false),
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute (interaction) {
        return await interaction.reply({ content: `Pong ~ ${interaction.client.ws.ping}`, ephemeral: true });
    }
}