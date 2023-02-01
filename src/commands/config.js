const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('@discordjs/builders');
const { ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName("config")
        .setDescription("Configure os comandos e canais.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute (interaction) {

        let buttonChannel = new ButtonBuilder()
            .setLabel("Canais")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configChannels")
        ;

        let buttonClose = new ButtonBuilder()
            .setLabel("Fechar")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("configClose")
        ;

        let buttonBack = new ButtonBuilder()
            .setLabel("Voltar")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("configBack")
        ;


        let buttonPunishment = new ButtonBuilder()
            .setLabel("Punições")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configPunish")
        ;

        let buttonWelcome = new ButtonBuilder()
            .setLabel("Entrada")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configWelcome")
        ;

        let buttonLogs = new ButtonBuilder()
            .setLabel("Logs")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configLogs")
        ;

        let menuEmbed = new interaction.client.embed("⚙️ Menu de Configurações")
            .setTimestamp()
            .setDescription("> Selecione a categoria desejada.")
        ;

        // db
        let db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
        if(!db){
            await new interaction.client.database.channelModel({
                serverId: interaction.guild.id
            }).save();
        }
        // db

        let menu = await interaction.reply({
            components: [new ActionRowBuilder().addComponents([buttonChannel, buttonClose])],
            embeds: [
                (
                    menuEmbed
                )
            ],
            ephemeral: true
        });

        const filter = (button) => button.user.id === interaction.user.id;
        const collector = menu.createMessageComponentCollector({ filter, time: 100000 });
        collector.on('collect', async c => {
            await c.deferUpdate();
            switch(c && c.customId){
                case "configChannels": {
                    if(!interaction.guild.channels.cache.get(db.channelWelcome) && db.channelWelcome !== null){
                        db.channelWelcome = null;
                        await db.save();
                    }
                    if(!interaction.guild.channels.cache.get(db.channelPunish) && db.channelPunish !== null){
                        db.channelPunish = null;
                        await db.save();
                    }
                    if(!interaction.guild.channels.cache.get(db.channelLogs) && db.channelLogs !== null){
                        db.channelLogs = null;
                        await db.save();
                    }
                    await interaction.editReply({
                        embeds: [
                            (
                                new interaction.client.embed("⚙️ Menu de Configurações - Canais 📝🔈")
                                .setDescription(`
                                    > Selecione o botão relacionado a sua configuração.

                                    **∙ Punições:** ${(db.channelPunish !== null ? '<#' + db.channelPunish + '>' : "Não definido")}
                                    **∙ Entrada:** ${(db.channelWelcome !== null ? '<#' + db.channelWelcome + '>' : "Não definido")}
                                    **∙ Logs:** ${(db.channelLogs !== null ? '<#' + db.channelLogs + '>' : "Não definido")}
                                `)
                                .setFooter({ text: "Para desativar basta apagar o canal, ou selecionar 'Remover' no menu." })
                            )
                        ],
                        components: [new ActionRowBuilder().addComponents([buttonPunishment, buttonWelcome, buttonLogs, buttonBack])]
                    });
                    break;
                }
                case "configPunish": {
                    let embedPunish = new interaction.client.embed().setDescription("> Selecione abaixo no menu o canal desejado.");
                    function chunkify(arr, len) {
                        let chunks = [];
                        let i = 0;
                        let n = arr.length;
                        while (i < n)
                          chunks.push(arr.slice(i, (i += len)));
                        return chunks;
                      }

                    const row = [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('configSelectPunish')
                                .setPlaceholder('Selecione o canal de punições.')
                                .addOptions(
                                    {
                                        label: 'Cancelar',
                                        description: "Cancele esta seleção.",
                                        value: 'cancel'
                                    },
                                    {
                                        label: 'Remover',
                                        description: "Desative esta funcionalidade.",
                                        value: 'disable'
                                    }
                                )
                        )
                    ]

                    await interaction.guild.channels.fetch();
                    let optionsChannels = await interaction.guild.channels.cache.filter(c => c.type === 0).map((channel) => ({
                        label: channel.name,
                        description: " ",
                        value: channel.id
                    }));

                    const chunks = chunkify(optionsChannels, 24);
                    chunks.forEach((op, i) => {
                        if(i === 0){
                            row[0].components[0].addOptions(op);
                        }else{
                            row.push(new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder().setCustomId(`channel-${i}`)
                                .setPlaceholder('Selecione o canal de punições.')
                                .addOptions(op)
                            ));
                        }
                    });
                    await interaction.editReply({ components: row }).catch(e=>console.log(e));
                    const filterSelect = (int) => interaction.isSelectMenu() && interaction.user.id === int.user.id;
                    const collectorSelect = menu.createMessageComponentCollector({ filter, time: 100000 });
                    collectorSelect.on('collect', async (selec) => {
                        switch(selec.values[0]){
                            case "cancel": {
                                await interaction.deleteReply().catch(e=>{});
                                break;
                            }
                            case "disable": {
                                if(!db){
                                    await new interaction.client.database.channelModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                    db.channelPunish = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Punições\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    await new interaction.client.database.channelModel({
                                        serverId: interaction.guild.id,
                                        channelPunish: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                    db.channelPunish = selec.values[0];
                                    await db.save();
                                }
                                break;
                            }
                        }
                    });
                    break;
                }
                case "configWelcome": {
                    let embedWelcome = new interaction.client.embed().setDescription("> Selecione abaixo no menu o canal desejado.");
                    function chunkify(arr, len) {
                        let chunks = [];
                        let i = 0;
                        let n = arr.length;
                        while (i < n)
                          chunks.push(arr.slice(i, (i += len)));
                        return chunks;
                      }

                    const row = [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('configSelectWelcome')
                                .setPlaceholder('Selecione o canal de entrada.')
                                .addOptions(
                                    {
                                        label: 'Cancelar',
                                        description: "Cancele esta seleção.",
                                        value: 'cancel'
                                    },
                                    {
                                        label: 'Remover',
                                        description: "Desative esta funcionalidade.",
                                        value: 'disable'
                                    }
                                )
                        )
                    ]

                    await interaction.guild.channels.fetch();
                    let optionsChannels = await interaction.guild.channels.cache.filter(c => c.type === 0).map((channel) => ({
                        label: channel.name,
                        description: " ",
                        value: channel.id
                    }));

                    const chunks = chunkify(optionsChannels, 24);
                    chunks.forEach((op, i) => {
                        if(i === 0){
                            row[0].components[0].addOptions(op);
                        }else{
                            row.push(new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder().setCustomId(`channel-${i}`)
                                .setPlaceholder('Selecione o canal de entrada')
                                .addOptions(op)
                            ));
                        }
                    });
                    await interaction.editReply({ components: row }).catch(e=>console.log(e));
                    const filterSelect = (int) => interaction.isSelectMenu() && interaction.user.id === int.user.id;
                    const collectorSelect = menu.createMessageComponentCollector({ filter, time: 100000 });
                    collectorSelect.on('collect', async (selec) => {
                        switch(selec.values[0]){
                            case "cancel": {
                                await interaction.deleteReply().catch(e=>{});
                                break;
                            }
                            case "disable": {
                                if(!db){
                                    await new interaction.client.database.channelModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                    db.channelWelcome = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Entrada\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    await new interaction.client.database.channelModel({
                                        serverId: interaction.guild.id,
                                        channelWelcome: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                    db.channelWelcome = selec.values[0];
                                    await db.save();
                                }
                                break;
                            }
                        }
                    });
                    break;
                }
                case "configLogs": {
                    let embedLogs = new interaction.client.embed().setDescription("> Selecione abaixo no menu o canal desejado.");
                    function chunkify(arr, len) {
                        let chunks = [];
                        let i = 0;
                        let n = arr.length;
                        while (i < n)
                          chunks.push(arr.slice(i, (i += len)));
                        return chunks;
                      }

                    const row = [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('configSelectLogs')
                                .setPlaceholder('Selecione o canal de logs.')
                                .addOptions(
                                    {
                                        label: 'Cancelar',
                                        description: "Cancele esta seleção.",
                                        value: 'cancel'
                                    },
                                    {
                                        label: 'Remover',
                                        description: "Desative esta funcionalidade.",
                                        value: 'disable'
                                    }
                                )
                        )
                    ]

                    await interaction.guild.channels.fetch();
                    let optionsChannels = await interaction.guild.channels.cache.filter(c => c.type === 0).map((channel) => ({
                        label: channel.name,
                        description: " ",
                        value: channel.id
                    }));

                    const chunks = chunkify(optionsChannels, 24);
                    chunks.forEach((op, i) => {
                        if(i === 0){
                            row[0].components[0].addOptions(op);
                        }else{
                            row.push(new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder().setCustomId(`channel-${i}`)
                                .setPlaceholder('Selecione o canal de logs')
                                .addOptions(op)
                            ));
                        }
                    });
                    await interaction.editReply({ components: row }).catch(e=>console.log(e));
                    const filterSelect = (int) => interaction.isSelectMenu() && interaction.user.id === int.user.id;
                    const collectorSelect = menu.createMessageComponentCollector({ filter, time: 100000 });
                    collectorSelect.on('collect', async (selec) => {
                        switch(selec.values[0]){
                            case "cancel": {
                                await interaction.deleteReply().catch(e=>{});
                                break;
                            }
                            case "disable": {
                                if(!db){
                                    await new interaction.client.database.channelModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                    db.channelLogs = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Logs\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    await new interaction.client.database.channelModel({
                                        serverId: interaction.guild.id,
                                        channelLogs: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.channelModel.findOne({ serverId: interaction.guild.id });
                                    db.channelLogs = selec.values[0];
                                    await db.save();
                                }
                                break;
                            }
                        }
                    });
                    break;
                    break;
                }
                case "configBack": {
                    await interaction.editReply({ embeds: [ menuEmbed ], components: [new ActionRowBuilder().addComponents([buttonChannel, buttonClose])] });
                    break;
                }
                case "configClose": {
                    await interaction.deleteReply().catch(e=>{});
                    break;
                }
            }
        });

    }
}