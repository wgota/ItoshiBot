const { Events } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		let db = await member.client.database.channelModel.findOne({ serverId: member.guild.id });
		if(!db){
			await member.client.database.channelModel({
				serverId: member.guild.id
			}).save();
		}
		db = await member.client.database.channelModel.findOne({ serverId: member.guild.id });
		if(db.channelWelcome !== null){
			if(!member.guild.channels.cache.get(db.channelWelcome)) return;
			member.guild.channels.cache.get(db.channelWelcome).send({
				embeds: [
					(
						new member.client.embed()
						.setDescription(`
							\`🙋‍♂️\` | *Olá <@${member.id}> Seja Bem-vindo ao Servidor **\`${member.guild.name}\`***
						`)
						.addFields(
							{ name: "Agora somos:", value: `${member.guild.members.cache.filter(m => !m.user.bot).size} membros` }
						)
						.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
						.setThumbnail(member.guild.bannerURL())
						.setTimestamp()
						.setFooter({ text: member.guild.name + " ©️" })
					)
				]
			});
		}

		if(db.channelLogs !== null){
			if(!member.guild.channels.cache.get(db.channelLogs)) return;
			member.guild.channels.cache.get(db.channelLogs).send({
				embeds: [
					(
						new member.client.embed(`📥 Entrada`)
						.setDescription(`
							\`🙋‍♂️\` | *<@${member.id}> **\`(${member.id})\`** entrou no servidor.*
							Data da conta: \`${moment(member.user.createdAt).format('LLL')}\`
							Entrou em: \`${moment(member.joinedAt).format('LLL')}\`
						`)
						.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
						.setThumbnail(member.guild.bannerURL())
						.setTimestamp()
						.setFooter({ text: member.guild.name + " ©️" })
					)
				]
			});
		}
	}
};