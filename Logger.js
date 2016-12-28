require('./Providers/General.js');

var MainLogger = function () {
};

var AbstractLogger = function (providers,format) {

    this.providers = providers;
 this.providers = providers;

    this.send = function (obj) {
        index = 0;
        this.providers.forEach(function (item) {
            item.log(obj,format[index]);
            index++;
        });
    }

}

AbstractLogger.prototype.log = function (type, text, tags, extras) {
    // console.log(type, text, tags, extras);
    var date = new Date();
    var timeStamp = date.getTime();
    var date = formatDate(timeStamp);

    this.send({ date: date, timeStamp: timeStamp, text: text, type: type, text: text, tag: tags, extras: extras });
};

AbstractLogger.prototype.error = function (tags, text, extras) {
    this.log('error', text, tags, extras);
};

AbstractLogger.prototype.info = function (tags, text, extras) {
    this.log('info', text, tags, extras);
};

AbstractLogger.prototype.warning = function (tags, text, extras) {
    this.log('warning', text, tags, extras);

};

AbstractLogger.prototype.debug = function (tags, text, extras) {
    this.log('debug', text, tags, extras);

};

AbstractLogger.prototype.fatal = function (tags, text, extras) {
    this.log('fatal', text, tags, extras);
};

MainLogger.prototype.Logger = AbstractLogger;

MainLogger.prototype.ProviderTelnet = require('./Providers/Telnet.js');
MainLogger.prototype.ProviderMongo = require('./Providers/Mongo.js');
MainLogger.prototype.ProviderConsole = require('./Providers/Console.js');



module.exports = new MainLogger();
