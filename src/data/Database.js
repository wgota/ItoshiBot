const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
const Schema = mongoose.Schema;
// const { logger, config } = require('../exports');
const logger = require('../utils/chalk');
const config = require('../../config.json');

class Database {
  static async authenticate(){
    mongoose.connect(config.databaseURI,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(function(){
      logger.log('Database conectado com sucesso!');
    }).catch(function(e){
      logger.error('O database não foi conectado.');
      console.log(e);
    });
  }
}

module.exports = Database;