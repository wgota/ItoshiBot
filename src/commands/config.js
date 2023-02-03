const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('@discordjs/builders');
const { ButtonStyle, PermissionFlagsBits, ModalBuilder, TextInputComponent, TextInputBuilder, TextInputStyle } = require('discord.js');

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

        let buttonCommands = new ButtonBuilder()
            .setLabel("Comandos")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configCommands")
        ;

        let buttonSystem = new ButtonBuilder()
            .setLabel("Sistemas")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configSystem")
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

        let buttonSugestion = new ButtonBuilder()
            .setLabel("Sugestão")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("configSugestion")
        ;

        let menuEmbed = new interaction.client.embed("⚙️ Menu de Configurações")
            .setTimestamp()
            .setDescription("> Selecione a categoria desejada.")
        ;

        // db
        let db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
        if(!db){
            await new interaction.client.database.configModel({
                serverId: interaction.guild.id
            }).save();
        }
        // db

        let menu = await interaction.reply({
            components: [new ActionRowBuilder().addComponents([buttonChannel, buttonCommands, buttonSystem, buttonClose])],
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
            // await c.deferUpdate();
            switch(c && c.customId){
                case "configChannels": {
                    await c.deferUpdate();
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
                                    **∙ Sugestão:** ${(db.channelSugestion !== null ? '<#' + db.channelSugestion + '>' : "Não definido")}
                                `)
                                .setFooter({ text: "Para desativar basta apagar o canal, ou selecionar 'Remover' no menu." })
                            )
                        ],
                        components: [new ActionRowBuilder().addComponents([buttonPunishment, buttonWelcome, buttonLogs, buttonSugestion, buttonBack])]
                    });
                    break;
                }
                case "configCommands": {

                    await c.deferUpdate();

                    const commands = [
                        // {
                        //     label: "",
                        //     description: "",
                        //     value: ""
                        // }
                        {
                            label: "Online",
                            description: " ",
                            value: "online"
                        }
                    ];

                    let embedCommands = new interaction.client.embed(`⚙️ Configurações - Comandos`)
                        .setDescription(`
                            > Selecione abaixo o comando.

                            **∙ Online:** ${((db.commandOnline['ip'] !== null) && (db.commandOnline['ip'] !== "null")) ? `\`\`${db.commandOnline['ip']}:${db.commandOnline['port']}\`\`` : "Desativado"}
                        `);
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('configSelectCommands')
                                .setPlaceholder("Selecione o comando.")
                                .addOptions([
                                    {
                                        label: '❌ Cancelar',
                                        description: "Cancele esta seleção.",
                                        value: 'cancel'
                                    }
                                ])
                        )
                    ;
                    row.components[0].addOptions(commands);
                    await interaction.editReply({
                        ephemeral: true,
                        components: [row],
                        embeds: [embedCommands]
                    });
                    const filterSelect = (int) => interaction.isSelectMenu() && interaction.user.id === int.user.id;
                    const collectorSelect = menu.createMessageComponentCollector({ filter, time: 100000 });
                    collectorSelect.on('collect', async (selec) => {
                        switch(selec.values[0]){
                            case "cancel": {
                                await interaction.deleteReply().catch(e=>{});
                                break;
                            }
                            case "online": {
                                const modal = new ModalBuilder()
                                    .setCustomId('configOnlineModal')
                                    .setTitle('⚙️ Configurações - ' + selec.values[0])
                                    .addComponents(
                                        [
                                            (
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new TextInputBuilder()
                                                            .setCustomId('configOnlineModalStringIP')
                                                            .setLabel('IP Numerico')
                                                            .setMinLength(11)
                                                            .setMaxLength(15)
                                                            .setRequired(true)
                                                            .setStyle(TextInputStyle.Short)
                                                            .setPlaceholder('Exemplo: 123.45.78.910')
                                                    )
                                            ),
                                            (
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new TextInputBuilder()
                                                            .setCustomId('configOnlineModalStringPort')
                                                            .setLabel('Porta')
                                                            .setMinLength(5)
                                                            .setMaxLength(5)
                                                            .setRequired(true)
                                                            .setStyle(TextInputStyle.Short)
                                                            .setPlaceholder('Exemplo: 22003')
                                                    )
                                            )
                                        ]
                                    )
                                ;

                                await selec.showModal(modal);

                                const filter = (i) => !selec.isModalSubmit() && interaction.user.id === i.user.id;
                                await selec.awaitModalSubmit({ filter, time: 1.8e+6 }).then(async (int) => {
                                    switch(int.customId){
                                        case "configOnlineModal": {
                                            await int.deferUpdate();
                                            const ip = (int.fields.getTextInputValue('configOnlineModalStringIP')),
                                                port = (int.fields.getTextInputValue('configOnlineModalStringPort'));
                                            
                                            if(isNaN(port)){
                                                await interaction.editReply({
                                                    ephemeral: true,
                                                    components: [],
                                                    embeds: [
                                                        new interaction.client.embed()
                                                            .setDescription(`> IP ou Porta inválido.`)
                                                    ]
                                                });
                                            }

                                            const { APIController }= require('../exports');
                                            let fetch = await APIController.fetchMTA(ip, port);
                                            if(!fetch){
                                                await interaction.editReply({
                                                    ephemeral: true,
                                                    components: [],
                                                    embeds: [
                                                        new interaction.client.embed()
                                                            .setDescription(`> IP ou Porta inválido.`)
                                                    ]
                                                });
                                            }else{
                                                let dataConfig = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                                if(!dataConfig){
                                                    await new interaction.client.database.configModel({
                                                        serverId: interaction.guild.id
                                                    }).save();
                                                }else{
                                                    dataConfig = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                                    dataConfig.commandOnline = {
                                                        ip: ip,
                                                        port: port
                                                    }
                                                    await dataConfig.save();
                                                }
                                                await interaction.editReply({
                                                    ephemeral: true,
                                                    components: [],
                                                    embeds: [
                                                        new interaction.client.embed()
                                                            .setDescription(`> Comando **\`${selec.values[0]}\`** atualizado.\n**IP** \`${ip}\` | **Porta**: \`${port}\``)
                                                    ]
                                                });
                                            }
                                            break;
                                        }
                                    }
                                }).catch(e=>console.log(e));

                                break;
                            }
                        }
                    });
                    break;
                }
                case "configSystem": {
                    await c.deferUpdate();

                    const systems = [
                        // {
                        //     label: "",
                        //     description: "",
                        //     value: ""
                        // }
                        {
                            label: "Entrada",
                            description: " ",
                            value: "welcomeSystem"
                        },
                        {
                            label: "AutoRole",
                            description: " ",
                            value: "autoRoleSystem"
                        }
                    ];

                    let embedSystem = new interaction.client.embed(`⚙️ Configurações - Sistemas`)
                        .setDescription(`
                            > Selecione abaixo o sistema desejado.

                            **∙ Entrada:** ${(db.messageWelcome !== null ? "Ativado" : "Desativado")}
                            **∙ AutoRole:** ${(db.autoRoles !== null ? db.autoRoles.map(r => `<@&${r}>`) : "Desativado")}
                        `)
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('configSelectSystem')
                                .setPlaceholder("Selecione o sistema.")
                                .addOptions([
                                    {
                                        label: '❌ Cancelar',
                                        description: "Cancele esta seleção.",
                                        value: 'cancel'
                                    }
                                ])
                        )
                    ;
                    row.components[0].addOptions(systems);
                    await interaction.editReply({
                        ephemeral: true,
                        components: [row],
                        embeds: [embedSystem]
                    });
                    const filterSelect = (int) => interaction.isSelectMenu() && interaction.user.id === int.user.id;
                    const collectorSelect = menu.createMessageComponentCollector({ filter, time: 100000 });
                    collectorSelect.on('collect', async (selec) => {
                        switch(selec.values[0]){
                            case "cancel": {
                                await interaction.deleteReply().catch(e=>{});
                                break;
                            }
                            case "welcomeSystem": {

                                const modal = new ModalBuilder()
                                    .setCustomId('configWelcomeModal')
                                    .setTitle('⚙️ Configurações - Entrada')
                                    .addComponents(
                                        [
                                            (
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new TextInputBuilder()
                                                            .setCustomId('configWelcomeModalStringTitle')
                                                            .setLabel('Título')
                                                            .setMaxLength(300)
                                                            .setRequired(false)
                                                            .setStyle(TextInputStyle.Short)
                                                            .setPlaceholder('Digite o título da mensagem. (Opcional)')
                                                    )
                                            ),
                                            (
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new TextInputBuilder()
                                                            .setCustomId('configWelcomeModalStringMessage')
                                                            .setLabel('Descrição')
                                                            .setMinLength(1)
                                                            .setMaxLength(2500)
                                                            .setRequired(true)
                                                            .setStyle(TextInputStyle.Paragraph)
                                                            .setPlaceholder('@p = usuário | @s = servidor | @c = contador')
                                                    )
                                            ),
                                            (
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new TextInputBuilder()
                                                            .setCustomId('configWelcomeModalStringFooter')
                                                            .setLabel('Rodapé')
                                                            .setMaxLength(300)
                                                            .setRequired(false)
                                                            .setStyle(TextInputStyle.Short)
                                                            .setPlaceholder('@s = servidor')
                                                    )
                                            )
                                        ]
                                    )
                                ;

                                await selec.showModal(modal);

                                const filter = (i) => !selec.isModalSubmit() && interaction.user.id === i.user.id;
                                await selec.awaitModalSubmit({ filter, time: 1.8e+6 }).then(async (int) => {
                                    switch(int.customId){
                                        case "configWelcomeModal": {
                                            await int.deferUpdate();
                                            const title = (int.fields.getTextInputValue('configWelcomeModalStringTitle')||null),
                                                desc = (int.fields.getTextInputValue('configWelcomeModalStringMessage')),
                                                footer = (int.fields.getTextInputValue('configWelcomeModalStringFooter')||null)
                                            ;

                                            try {
                                                let embedBuild = new interaction.client.embed();
                                                if(title) embedBuild.setTitle(title);
                                                embedBuild.setDescription(desc.replace(/@p/g, `<@${interaction.user.id}>`).replace(/@s/g, interaction.guild.name).replace(/@c/g, interaction.guild.members.cache.filter(m => !m.user.bot).size))
                                                embedBuild.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }) });
                                                embedBuild.setTimestamp();
                                                ;
                                                if(footer) embedBuild.setFooter({ text: footer.replace(/@s/g, interaction.guild.name) });
                                                await interaction.editReply({
                                                    content: `${interaction.user.toString()} assim ficará seu embed de entrada:`,
                                                    ephemeral: true,
                                                    embeds: [embedBuild],
                                                    components: []
                                                });

                                                let dataWelcome = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                                if(!dataWelcome){
                                                    await new interaction.client.database.configModel({
                                                        serverId: interaction.guild.id,
                                                        messageWelcome: {
                                                            title: title,
                                                            description: desc,
                                                            footer: footer
                                                        }
                                                    }).save();
                                                }else{
                                                    dataWelcome = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                                    dataWelcome.messageWelcome = {
                                                        title: title,
                                                        description: desc,
                                                        footer: footer
                                                    }
                                                    await dataWelcome.save();
                                                }

                                            } catch(e){
                                                console.log(e);
                                                return await interaction.editReply({
                                                    ephemeral: true,
                                                    embeds: [
                                                        new interaction.client.embed().setDescription(`> \`❌\` Embed inválido.`)
                                                    ],
                                                    components: []
                                                });
                                            }
                                            
                                        }
                                    }
                                }).catch(e=>console.log(e));

                                break;
                            }
                            case "autoRoleSystem": {

                                await selec.deferUpdate();
                                let embedAutoRole = new interaction.client.embed().setDescription("> Selecione abaixo os cargos desejados.");

                                const row = [new ActionRowBuilder()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId('selectAutoRoleSystem')
                                            .setPlaceholder('Selecione pelo menos 1 cargo.')
                                            .setMinValues(1)
                                            .setMaxValues(3)
                                            .addOptions([
                                                {
                                                    label: '❌ Cancelar',
                                                    description: "Cancele esta seleção.",
                                                    value: 'cancel'
                                                }
                                            ])
                                    )
                                ];

                                await interaction.guild.roles.fetch();
                                let optionsRoles = await interaction.guild.roles.cache.filter(c => c.name !== '@everyone').map((role) => ({
                                    label: `${role.name}`,
                                    description: " ",
                                    value: role.id
                                }));
            
                                function chunkify(arr, len) {
                                    let chunks = [];
                                    let i = 0;
                                    let n = arr.length;
                                    while (i < n)
                                      chunks.push(arr.slice(i, (i += len)));
                                    return chunks;
                                  }

                                const chunks = chunkify(optionsRoles, 24);
                                chunks.forEach((op, i) => {
                                    if(i === 0){
                                        row[0].components[0].addOptions(op);
                                    }else{
                                        row.push(new ActionRowBuilder().addComponents(
                                            new StringSelectMenuBuilder().setCustomId(`role-${i}`)
                                            .setPlaceholder('Selecione os cargos.')
                                            .addOptions(op)
                                        ));
                                    }
                                });

                                await interaction.editReply({
                                    ephemeral: true,
                                    embeds: [embedAutoRole],
                                    components: row
                                });

                                const filterSelectRole = (int) => interaction.isStringSelectMenu() && interaction.user.id === int.user.id;
                                const collectorSelectRole = menu.createMessageComponentCollector({ filterSelectRole, time: 100000 });
                                collectorSelectRole.on('collect', async (selecRole) => {
                                    const values = selecRole.values;
                                    const dataRoles = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    if(!dataRoles){
                                        await new interaction.client.database.configModel({
                                            serverId: interaction.guild.id,
                                            autoRoles: values.map(r => r)
                                        }).save();
                                    }else{
                                        dataRoles.autoRoles = values.map(r => r);
                                        await dataRoles.save();
                                    }
                                    await interaction.editReply({
                                        ephemeral: true,
                                        embeds: [new interaction.client.embed().setDescription(`> Você adicionou os cargos ${values.map(r => `<@&${r}>`).join(", ")}.`)],
                                        components: []
                                    });
                                });

                                break;
                            }
                        }
                    });
                    break;
                }
                case "configPunish": {
                    await c.deferUpdate();
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
                                        label: '❌ Cancelar',
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
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    db.channelPunish = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Punições\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    console.log("criando4");
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id,
                                        channelPunish: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
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
                    await c.deferUpdate();
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
                                        label: '❌ Cancelar',
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
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    db.channelWelcome = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Entrada\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id,
                                        channelWelcome: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
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
                    await c.deferUpdate();
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
                                        label: '❌ Cancelar',
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
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    db.channelLogs = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Logs\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id,
                                        channelLogs: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    db.channelLogs = selec.values[0];
                                    await db.save();
                                }
                                break;
                            }
                        }
                    });
                    break;
                }
                case "configSugestion": {
                    await c.deferUpdate();
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
                                .setCustomId('configSelectSugestion')
                                .setPlaceholder('Selecione o canal de sugestão.')
                                .addOptions(
                                    {
                                        label: '❌ Cancelar',
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
                                .setPlaceholder('Selecione o canal de sugestão')
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
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    db.channelSugestion = null;
                                    await db.save();
                                }
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Canal \`Sugestão\` desativado.`)]});
                                break;
                            }
                            default: {
                                if(selec.values[0] === null) return;
                                await interaction.editReply({ components: [], embeds: [new interaction.client.embed().setDescription(`Você selecionou o canal <#${selec.values[0]}>.`)]});
                                let db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                if(!db){
                                    await new interaction.client.database.configModel({
                                        serverId: interaction.guild.id,
                                        channelSugestion: selec.values[0]
                                    }).save();
                                }else{
                                    db = await interaction.client.database.configModel.findOne({ serverId: interaction.guild.id });
                                    db.channelSugestion = selec.values[0];
                                    await db.save();
                                }
                                break;
                            }
                        }
                    });
                    break;
                }
                case "configBack": {
                    await c.deferUpdate();
                    await interaction.editReply({ embeds: [ menuEmbed ], components: [new ActionRowBuilder().addComponents([buttonChannel, buttonCommands, buttonClose])] });
                    break;
                }
                case "configClose": {
                    await c.deferUpdate();
                    await interaction.deleteReply().catch(e=>{});
                    break;
                }
            }
        });

    }
}