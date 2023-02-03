const logger = require("./utils/chalk");
const config = require('../config.json');
const Embed = require('./utils/embed');
const data = require('./data/index');
const package = require('../package.json');
const format = require('./utils/format');

const wait = require('node:timers/promises').setTimeout;

const APIController = require('./controllers/APIController');

module.exports = {
    logger,
    config,
    Embed,
    wait,
    data,
    package,
    format,
    APIController
}