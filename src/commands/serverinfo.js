const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');
const moment = require('moment');
const { format: { parseMilliseconds: ms } } = require('../exports');

function timer(delay, db){
    if(isNaN(delay)) return new Error("is a NaN");
    let time = ms(delay);
    let timeReturn = "";
    if(time.days !== 0)
        timeReturn += `\`${time.days} dias `;
    if(time.hours !== 0)
        timeReturn += `${time.hours} horas `;
    if(time.minutes !== 0)
        timeReturn += `${time.minutes} minutos\``;
    return { timeReturn, time };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Veja informações do servidor.")
        .setDMPermission(false),
    async execute (interaction) {

        let embed = new interaction.client.embed(`📰 Informações sobre o servidor`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'png' }))
            .setTimestamp()
        ;
        if(interaction.guild.banner) embed.setImage(interaction.guild.bannerURL({ format: 'png', dynamic: true, size: 4096 }));
        let ownerFetched = await interaction.guild.fetchOwner();
        let createdAt = timer(Date.now() - interaction.guild.createdAt);
        if(createdAt.time === 0) createdAt.timeReturn = "Recentemente";
        embed.addFields(
            { name: `> \`📄\` Nome`, value: interaction.guild.name, inline: true },
            { name: `> \`📋\` ID`, value: interaction.guild.id, inline: true },
            { name: `> \`👑\` Dono`, value: ownerFetched.user.toString(), inline: true },
            { name: `\`📅\` Criado em`, value: `${moment(interaction.guild.createdAt).format('LLL')} (${createdAt.timeReturn})` }
        )
        await interaction.guild.channels.fetch();
        embed.addFields(
            { name: (`
                \`🔎\` **Canais:**\nㅤ**∙** Texto**: \`${interaction.guild.channels.cache.filter(c => c.type !== ChannelType.GuildVoice && c.type !== ChannelType.GuildStageVoice).size}\`\nㅤ**∙** Voz**: \`${interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}\`
            `), value: "\u200B", inline: true },
        )

        await interaction.reply({ embeds: [embed] , ephemeral: true });
    }
}