var x = require('./Logger.js');

var consoleProvider = new x.ProviderConsole();
var telnetProvider = new x.ProviderTelnet({ port: 2101 });

var logger = new x.Logger([consoleProvider, telnetProvider]);

var extra = { 'username': '989395661231' }

setTimeout(function () {
    logger.info('tag', 'message', extra);
    logger.error('tag', 'message', extra);
    logger.fatal('tag', 'message', extra);
    logger.debug('tag', 'message', extra);
    logger.warning('tag', 'message', extra);
}, 10000);
