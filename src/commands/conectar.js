const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { APIController } = require('../exports');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("conectar")
        .setDescription("Veja as estatísticas do servidor.")
        .setDMPermission(false),
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute (interaction) {
        let { commandOnline: { ip, port } } = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
        if(!ip || !port){
            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new interaction.client.embed()
                        .addFields([
                            {
                                name: `> Status Server`, value: `\`\`\`ansi\n[0;31mOffline\`\`\``, inline: true
                            },
                            {
                                name: `> IP`, value: `\`\`\`ansi\n[0;37m${(getAPI.connect||"Desativado")}\`\`\``, inline: false
                            }
                        ])
                ]
            });
        }else{
            let getAPI = await APIController.fetchMTA(ip, port);
            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new interaction.client.embed()
                        .addFields([
                            {
                                name: `> Status Server`, value: `\`\`\`ansi\n[0;32mOnline\`\`\``, inline: true
                            },
                            {
                                name: `> Jogadores Online`, value: `\`\`\`ansi\n[0;34m${getAPI.raw.numplayers}/${getAPI.maxplayers}\`\`\``, inline: true
                            },
                            {
                                name: `> IP`, value: `\`\`\`ansi\n[0;37mconnect mtasa://${getAPI.connect}/\`\`\``, inline: false
                            }
                        ])
                ]
            });
        }
    }
}