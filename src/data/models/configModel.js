const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigModel = new Schema({
	channelPunish: { type: String, default: null },
    channelWelcome: { type: String, default: null },
	channelLogs: { type: String, default: null },
	channelSugestion: { type: String, default: null },

	commandOnline: { ip: { type: String, default: null }, port: { type: String, default: null } },

	messageWelcome: { title: { type: String, default: null }, description: { type: String, default: null }, footer: { type: String, default: null } },
	autoRoles: { type: Array, default: [] },

	serverId: { type: String, required: true },
	messages: { type: Number, default: 0 }
});

module.exports = mongoose.model("Config", ConfigModel);