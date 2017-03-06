var DemnehLog = require('./Logger.js');

var consoleProvider = new DemnehLog.ProviderConsole();
// var mongoProvider = new DemnehLog.ProviderMongo({ mongodb: { address: 'mongodb://sansrv01.demnehapp.com/demnehLogger' } });
// var telnetProvider = new DemnehLog.ProviderTelnet({ port: 2101, mongodb: { address: 'mongodb://sansrv01.demnehapp.com/demnehLogger' } });

var logger = new DemnehLog.Logger([consoleProvider], ['title,text']);

// var extra = { 'username': '989395661231' }

logger.info('tag', 'this is an info log');
logger.error('tag', 'this is an error');
logger.fatal('tag', 'this is a fatal error');
logger.debug('tag', 'this is a debug log');
logger.warning('tag', 'this is a warning');

// setTimeout(function () {
//     logger.info('tag', 'message', extra);
//     logger.error('tag', 'message', extra);
//     logger.fatal('tag', 'message', extra);
//     logger.debug('tag', 'message', extra);
//     logger.warning('tag', 'message', extra);
// }, 3000);
