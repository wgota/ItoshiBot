const { Events } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		let db = await member.client.database.configModel.findOne({ serverId: member.guild.id });
		if(!db){
			await member.client.database.configModel({
				serverId: member.guild.id
			}).save();
		}
		db = await member.client.database.configModel.findOne({ serverId: member.guild.id });
		if(db.channelWelcome !== null){
			if(!member.guild.channels.cache.get(db.channelWelcome)) return;
			const { title, description, footer } = db.messageWelcome;
			
			let embed = new member.client.embed().setTimestamp()
				.setDescription(description.replace(/@p/g, member.user.toString()).replace(/@s/g, member.guild.name).replace(/@c/g, member.guild.members.cache.filter(m => !m.user.bot).size))
				.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true, format: 'png' }) });
			;
			
			if(title) embed.setTitle(title);
			if(footer) embed.setFooter({ text: footer.replace(/@s/g, member.guild.name) });

			member.guild.channels.cache.get(db.channelWelcome).send({
				embeds: [embed]
			});
		}else{
			if(!member.guild.channels.cache.get(db.channelWelcome)) return;
			const { title, description, footer } = db.messageWelcome;
			
			let embed = new member.client.embed()
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

			member.guild.channels.cache.get(db.channelWelcome).send({
				embeds: [embed]
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

		if(db.autoRoles !== null && (db.autoRoles||0).length > 0) {
			db.autoRoles.map(r => {
				member.roles.addRole(r).catch(async (e)=>{
					let find = member.guild.roles.cache.get(r);
					if(!find){
						db.autoRoles = db.autoRoles.filter(l => l !== r);
						await db.save();
					}
				});
			});
		}

	}
};