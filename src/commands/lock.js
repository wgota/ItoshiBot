const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Desative o chat.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
    async execute (interaction) {

        let perm = interaction.channel.permissionsFor(interaction.guild.roles.everyone);

        let embed = new interaction.client.embed(`\`🔧\` Configurações de chat`)
            .setDescription(`> Chat **Desativado**.`)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }) })
        ;

        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });

        let msg = await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
}