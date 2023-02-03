const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban um usuário.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription("Selecione o usuário.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Digite o motivo')
                .setRequired(false)
        ),
    async execute (interaction) {
        const user = interaction.options.getUser('user'),
            reason = (interaction.options.getString('motivo')||"Não informado");

        if(user.id === interaction.user.id){
            return await interaction.reply({
                ephemeral: true,
                embeds: [
                    new interaction.client.embed(`\`❌\` Você não pode se banir.`)
                ]
            });
        }

        let member = await interaction.guild.members.fetch(user.id);
        if(!member){
            return await interaction.reply({
                ephemeral: true,
                embeds: [
                    new interaction.client.embed(`\`❌\` Não encontrei este usuário.`)
                ]
            });
        }

        if(!member.bannable){
            return await interaction.reply({
                ephemeral: true,
                embeds: [
                    new interaction.client.embed(`\`❌\` Não consegui banir este usuário.`)
                ]
            });
        }

        let embed = new interaction.client.embed(`\`🔨\` Punições - Ban`)
            .addFields([
                {
                    name: `\`👤\` User`, value: `\`\`\`ansi\n${user.tag} [0;31m(${user.id})\`\`\``, inline: true
                },
                {
                    name: `\`📄\` ID`, value: `\`\`\`${interaction.user.id}\`\`\``, inline: true
                },
                {
                    name: `\`📝\` Motivo`, value: `\`\`\`${reason}\`\`\``
                }
            ])
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }) })
            .setTimestamp()

        let data = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
        if(data.channelPunish !== null){
            interaction.guild.channels.cache.get(data.channelPunish).send({ embeds: [embed] }).catch(e=>{});
        }
        if(data.channelLogs !== null){
            interaction.guild.channels.cache.get(data.channelLogs).send({ embeds: [embed] }).catch(e=>{});
        }

        await interaction.guild.bans.create(user, {
            reason: reason,
            deleteMessageSeconds: 604800
        }).catch(async (e)=>{
            return await interaction.reply({
                ephemeral: true,
                embeds: [
                    new interaction.client.embed(`\`❌\` Não consegui banir este usuário.`)
                ]
            });
        });

        await interaction.reply({
            ephemeral: true,
            embeds: [
                new interaction.client.embed()
                    .setDescription(`> Você baniu ${user.tag} (\`${user.id}\`) por \`${reason}\``)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            ]
        });
    }
}