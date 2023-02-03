const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Envie um embed.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute (interaction) {
        const modal = new ModalBuilder()
            .setCustomId('sayModal')
            .setTitle("⚙️ Embed")
            .addComponents([
                (
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('sayImputChannel')
                            .setLabel("Canal")
                            .setPlaceholder(`Digite o ID ou o nome do canal.`)
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(25)
                            .setValue(interaction.channel.id)
                        )
                ),
                (
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('sayImputTitle')
                                .setLabel("Título")
                                .setPlaceholder("Digite o título da mensagem.")
                                .setRequired(false)
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(300)
                                .setValue("Comunicado")
                        )
                ),
                (
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('sayImputMessage')
                                .setLabel("Mensagem")
                                .setPlaceholder("Digite a mensagem que será enviada.")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(3072)
                        )
                )
            ])
        ;
        await interaction.showModal(modal);
        const filter = (i) => !interaction.isModalSubmit() && interaction.user.id === i.user.id;
        await interaction.awaitModalSubmit({ filter, time: 1.8e+6 }).then(async (interaction) => {
            switch(interaction.customId){
                case "sayModal": {
                    const channel = (interaction.fields.getTextInputValue('sayImputChannel')||interaction.channel.id),
                        title = (interaction.fields.getTextInputValue('sayImputTitle')||"Comunicado"),
                        message = interaction.fields.getTextInputValue('sayImputMessage');

                    await interaction.guild.channels.fetch();
                    const findChannel = interaction.guild.channels.cache.get(channel) || interaction.guild.channels.cache.find(r => r.name === channel) || interaction.guild.channels.cache.some(r => r.name === channel);
                    if(findChannel){
                        let msg = await findChannel.send({
                            embeds: [
                                new interaction.client.embed(title||"Comunicado")
                                .setDescription(message)
                            ]
                        }).catch(e=>{
                            return interaction.reply({
                                ephemeral: true,
                                embeds: [
                                    new interaction.client.embed().setDescription("Não consegui enviar a mensagem neste canal.")
                                    .setFooter({ text: `Canal: ${findChannel.toString()}` })
                                ]
                            });
                        });
                        await interaction.reply({
                            ephemeral: true,
                            embeds: [
                                new interaction.client.embed().setDescription(`> Mensagem enviada com sucesso, clique **[aqui](${msg.url})** para ir até ela.`)
                            ]
                        })
                    }else {
                        await interaction.reply({
                            ephemeral: true,
                            embeds: [
                                new interaction.client.embed().setDescription(`> Não encontrei o canal especificado.`)
                                .setFooter({ text: `Você procurou por: ${channel}` })
                            ]
                        })
                    }
                    break;
                }
            }
        }).catch(e=>{});
    }
}