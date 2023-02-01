const logger = require("./utils/chalk");
const config = require('../config.json');
const Embed = require('./utils/embed');
const data = require('./data/index');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
    logger,
    config,
    Embed,
    wait,
    data
}