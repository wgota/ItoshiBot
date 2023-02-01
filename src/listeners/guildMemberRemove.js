const { Events } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		let db = await member.client.database.channelModel.findOne({ serverId: member.guild.id });
		if(!db){
			await member.client.database.channelModel({
				serverId: member.guild.id
			}).save();
		}
		db = await member.client.database.channelModel.findOne({ serverId: member.guild.id });
		if(db.channelLogs !== null){
			if(!member.guild.channels.cache.get(db.channelLogs)) return;
			member.guild.channels.cache.get(db.channelLogs).send({
				embeds: [
					(
						new member.client.embed(`📤 Saida`)
						.setDescription(`
							\`🙋‍♂️\` | *<@${member.id}> **\`(${member.id})\`** saiu do servidor.*
							Saiu em: \`${moment(Date.now()).format('LLL')}\`
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