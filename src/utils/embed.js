const { EmbedBuilder  } = require('discord.js');
const { color } = require('../../config.json');

class Embed extends EmbedBuilder  {
    constructor(user, data={}){
        super(data);
        if(user) this.setTitle(user);
        this.setColor(color);
    }
}

module.exports = Embed;