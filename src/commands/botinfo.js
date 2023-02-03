const { SlashCommandBuilder } = require('@discordjs/builders');
const os = require('os-utils');
const { package, format: { delayString } } = require('../exports');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Veja informações do bot.")
        .setDMPermission(false),
    async execute (interaction) {
        return await interaction.reply({
            embeds: [
                new interaction.client.embed()
                    .setFooter({ text: "Para saber meus comandos use /ajuda  •  " + interaction.client.ws.ping + "ms" })
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ format: 'png', dynamic: true }) })
                    .setDescription(`> Desenvolvido por **[wgota](${package.homepage})** | Versão: \`${package.version}\``)
                    .addFields(
                        { name: `\`📄\` Detalhes`, value: `Desenvolvido em <:js:1070328092603711508> [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)` },
                        { name: `\`⏳\` Ligado à`, value: `${delayString(parseInt(os.processUptime() * 1000))} (<t:${parseInt((Date.now() - (os.processUptime() * 1000))/1000)}>)` }
                    )
            ],
            ephemeral: true
        });
    }
}