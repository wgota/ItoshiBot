const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Baixe o avatar de um usuário.")
        .setDMPermission(false)
        .addUserOption(op => op.setName("user").setDescription("Escolha o usuário.")),
    async execute (interaction) {
        const member = interaction.options.getMember("member") || interaction.member;
        const avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })
        await interaction.reply({ ephemeral: true, embeds: [
            (
                new interaction.client.embed()
                    .setDescription(`
                        > **➥ [Clique aqui](${member.user.displayAvatarURL({ format: 'png', dynamic: true })}) para baixar seu avatar.**
                    `)
                    .setTimestamp()
                    .setImage(avatar)
            )
        ]});
    }
}