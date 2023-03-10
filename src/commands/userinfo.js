const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Veja informações de um usuário.")
        .setDMPermission(false)
        .addUserOption(op => op.setName("user").setDescription("Escolha o usuário.")),
    async execute (interaction) {
        const member = await interaction.options.getMember("user") || interaction.member;
        let embed = new interaction.client.embed(`${member.nickname ? member.nickname : member.user.username}`)
            embed.addFields(
                { name: `> \`📋\` ID`, value: `\`${member.id}\``, inline: true },
                { name: `> \`📄\` Tag`, value: `\`${member.user.tag}\``, inline: true },
                { name: `\`📅\` Conta criada em:`, value: `\`${moment(member.user.createdAt).format('LLL')}\`` },
                { name: `\`🚀\` Entrou aqui em:`, value: `\`${moment(member.joinedAt).format('LLL')}\`` }
            )
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        ;
        if(member.roles.cache.filter(f => f.name !== '@everyone').map(r => r.toString()).length > 0){
            embed.addFields({ name: `\`🔮\` Cargos:`, value: member.roles.cache.filter(f => f.name !== '@everyone').sort((a, b) => b.position - a.position || b.id - a.id).map(r => r.toString()).join(", ")});
        }
        if(member.nickname !== null) embed.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        await interaction.reply({ embeds: [embed] , ephemeral: true });
    }
}