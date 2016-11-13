var Logger = require('./Logger.js');
//Providers
// require('./Providers/General.js');
var TelnetProviderClass = Logger.TelnetProviderClass;
var MongoProviderClass = Logger.MongoProviderClass;
var ConsoleProviderClass = Logger.ConsoleProviderClass;


var TelnetProvider = new TelnetProviderClass();
var MongoProvider = new MongoProviderClass({ mongodb: { address: 'mongodb://sansrv01.demnehapp.com/sanapp' } });
var ConsoleProvider = new ConsoleProviderClass();

//create Logger object
var Logger = new Logger([MongoProvider, ConsoleProvider, TelnetProvider]);


//Test Log
function sendLog() {
    var socket = { ip: '123.2.22.', port: 3212, username: 989395661231 };

    Logger.error('Socket,MessagePack,Authentication,WorkFlow', 'This is a error', socket)
    Logger.fatal('Socket', 'This is a fatal', socket)
    socket = { ip: '123.2.22.', port: 3212, username: 989121202719 };
    Logger.debug('Socket', 'This is a debug', socket)
    Logger.info('Socket', 'This is a info', socket)
    socket = { ip: '123.2.22.', port: 3212, username: 989395661231 };
    Logger.warning('Socket', 'This is a warning', socket)

    setTimeout(function () {
        sendLog();
    }, 8000);
}


sendLog();