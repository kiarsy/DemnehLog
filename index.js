var DemnehLog = require('./Logger.js');

var consoleProvider = new DemnehLog.ProviderConsole();
var mongoProvider = new DemnehLog.ProviderMongo({ mongodb: { address: 'mongodb://sansrv01.demnehapp.com/demnehLogger' } });
var telnetProvider = new DemnehLog.ProviderTelnet({ port: 2101, mongodb: { address: 'mongodb://sansrv01.demnehapp.com/demnehLogger' } });

var logger = new DemnehLog.Logger([consoleProvider, telnetProvider, mongoProvider], ['title,text','date,title,text',null]);

var extra = { 'username': '989395661231' }

setTimeout(function () {
    logger.info('tag', 'message', extra);
    logger.error('tag', 'message', extra);
    logger.fatal('tag', 'message', extra);
    logger.debug('tag', 'message', extra);
    logger.warning('tag', 'message', extra);
}, 3000);
