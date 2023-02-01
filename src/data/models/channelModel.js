const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChannelModel = new Schema({
	channelPunish: { type: String, default: null },
    channelWelcome: { type: String, default: null },
	channelLogs: { type: String, default: null },
	serverId: { type: String, required: true },
	messages: { type: Number, default: 0 }
});

module.exports = mongoose.model("Channel", ChannelModel);