const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearchat")
        .setDescription("Apague mensagens do chat.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => 
            option.setName('número')
                .setDescription("Digite o número de mensagens.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Selecione o usuário.')
                .setRequired(false)
        ),
    async execute (interaction) {
        const amount = interaction.options.getInteger('número'),
            user = interaction.options.getUser('user');

        const messages = await interaction.channel.messages.fetch({
            limit: amount + 1
        });

        const embed = new interaction.client.embed()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }) })
        ;

        if(user){
            let i = 0;
            const arr = [];
            (await messages).filter((msg) => {
                if(msg.author.id === user.id && amount > i) {
                    arr.push(msg);
                    i++;
                }
            });
            await interaction.channel.bulkDelete(arr).then(async (r) => {
                embed.setDescription(`> Foram apagadas \`${r.size}\` mensagens de ${user.toString()}.`);
                await interaction.reply({
                    ephemeral: true,
                    embeds: [embed]
                });
            });
        }else{
            await interaction.channel.bulkDelete(amount, true).then(async (r) => {
                embed.setDescription(`> Foram apagadas \`${r.size}\`.`);
                await interaction.reply({
                    ephemeral: false,
                    embeds: [embed]
                });
            });
        }
    }
}