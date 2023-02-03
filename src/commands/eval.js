const { SlashCommandBuilder } = require('@discordjs/builders');
const exp = require('../exports'),
  { logger } = require('../exports');
const util = require('util');
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evaluate")
        .addStringOption(option => 
            option.setName('code')
                .setDescription("Coloque o código.")
                .setRequired(true)
        ),
    async execute (interaction) {
        const client = interaction.client;
        const nick = interaction.member.nickname ? interaction.member.nickname : interaction.user.username;
        
        const evaled = {};
        const logs = [];
  
        const cb = '```';
  
        const token = client.token.split('').join('[\\s\\S]{0,2}');
        const rev = client.token.split('').reverse().join('[\\s\\S]{0,2}');
        const tokenRegex = new RegExp(`${token}|${rev}`, 'g');
  
        const print = (...a) => {
  
          const cleaned = a.map(o => {
            if (typeof o !== 'string') o = util.inspect(o);
            return o.replace(tokenRegex, '[TOKEN]');
          });
  
          if(!evaled.output){
            return logs.push(...cleaned);
          }
  
          evaled.output += evaled.output.endsWith('\n') ? cleaned.join(' ') : `\n${cleaned.join(' ')}`;
          const title = evaled.errored ? '☠\u2000**Erro**' : '📤\u2000**Resultado**';
  
          if (evaled.output.length + interaction.options.getString('code').length > 1900) evaled.output = 'Output muito longo.';
           evaled.interaction.edit(`📥\u2000**Entrada**${cb}js\n${interaction.options.getString('code')}\n${cb}\n${title}${cb}js\n${evaled.output}\n${cb}`);
  
        }
  
        try {
  
          let evalue = await eval(interaction.options.getString('code'));
          if (typeof evalue !== 'string') evalue = util.inspect(evalue);
          evalue = `${logs.join('\n')}\n${logs.length && evalue === 'undefined' ? '' : evalue}`;
          evalue = evalue.replace(tokenRegex, '[TOKEN]');
          if(evalue === '[TOKEN]') console.log(`\n${interaction.user.username} (ID: ${interaction.user.id}) Tentou pegar o token em ${interaction.guild.name} (GuildID: ${interaction.guild.id})\n`);
  
          if (evalue.length + interaction.options.getString('code').length > 1900) evalue = 'Output muito longo.';
          return interaction.reply({ content: `📥\u2000**Input**${cb}js\n${interaction.options.getString('code')}\n${cb}\n📤\u2000**Output**${cb}js\n${evalue}\n${cb}`, ephemeral: true }).then(sent => {
            evaled.interaction = sent;
            evaled.errored = false;
            evaled.output = evalue;
          });
  
        } catch(err) {
  
          console.log(' '); 
          logger.error('ㅤㅤㅤㅤㅤOcorreu um erro em um eval');
          logger.error('ㅤㅤㅤInformações: ' + err);
          console.log(' ');
  
          err = err.toString();
          err = `${logs.join('\n')}\n${logs.length && err === 'undefined' ? '' : err}`;
          err = err.replace(tokenRegex, '[TOKEN]');
          return interaction.reply({ content: `📥\u2000**Input**${cb}js\n${interaction.options.getString('code')}\n${cb}\n☠\u2000**Error**${cb}js\n${err.interaction}\n${cb}`, ephemeral: true }).then(sent => {
            evaled.interaction = sent;
            evaled.errored = true;
            evaled.output = err;
          });
  
        }
    }
}