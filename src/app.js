const client = require('./client/ItoshiClient');
const moment = require('moment');
moment.locale('pt-Br');

const { token } = require('../config.json');

client.login(token || process.env.TOKEN);