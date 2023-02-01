const chalk = require('chalk');
const moment = require('moment'),
    tzone = require('moment-timezone');

const clog = console.log;

function log(...msg) {
    msg.map(m => {
        clog(chalk.cyan(`[LOG] (${tzone.tz("America/Sao_Paulo").format('DD-MM-YYYY HH:mm:ss')}) : ` + m));
    });
    return msg.join("\n");
}

function say(...msg){ log(msg) }

function warn(...msg) {
    msg.map(m => {
        clog(chalk.yellow(`[WARN] (${tzone.tz("America/Sao_Paulo").format('DD-MM-YYYY HH:mm:ss')}) : ` + m));
    });
    return msg.join("\n");
}

function error(...msg) {
    msg.map(m => {
        clog(chalk.red(`[ERROR] (${tzone.tz("America/Sao_Paulo").format('DD-MM-YYYY HH:mm:ss')}) : ` + m));
    });
    return msg.join("\n");
}

module.exports = {
    say, warn, error, log
};