const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Baixe o avatar de um usuário.")
        .setDMPermission(false)
        .addUserOption(op => op.setName("user").setDescription("Escolha o usuário.")),
    async execute (interaction) {
        const member = await interaction.options.getMember("user") || interaction.member;
        const avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })
        await interaction.reply({ ephemeral: true, embeds: [
            (
                new interaction.client.embed()
                    .setDescription(`
                        > **➥ Avatar de [${member.toString()}](${member.user.displayAvatarURL({ format: 'png', dynamic: true })}).**
                    `)
                    .setTimestamp()
                    .setImage(avatar)
            )
        ], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setURL(member.user.displayAvatarURL({ format: 'png', dynamic: true })).setStyle(ButtonStyle.Link).setLabel('URL'))]});
    }
}